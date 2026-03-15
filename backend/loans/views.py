from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import LoanApplication
from .serializers import LoanApplicationSerializer, LoanApplicationListSerializer
from .predictor import predict_risk


class SubmitApplicationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoanApplicationSerializer(data=request.data)
        if serializer.is_valid():
            application = serializer.save()
            try:
                result = predict_risk(request.data)
                application.risk_score    = result['risk_score']
                application.risk_category = result['risk_category']
                application.save()

                return Response({
                    'id':             application.id,
                    'full_name':      application.full_name,
                    'risk_score':     application.risk_score,
                    'risk_category':  application.risk_category,
                    'is_default':     result['is_default'],
                    'threshold_used': result['threshold_used'],
                    'message':        'Application submitted and evaluated successfully.',
                }, status=status.HTTP_201_CREATED)

            except Exception as e:
                application.delete()
                return Response({
                    'error': f'Prediction failed: {str(e)}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApplicationListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        apps       = LoanApplication.objects.all()
        serializer = LoanApplicationListSerializer(apps, many=True)
        return Response(serializer.data)


class ApplicationDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            app        = LoanApplication.objects.get(pk=pk)
            serializer = LoanApplicationSerializer(app)
            return Response(serializer.data)
        except LoanApplication.DoesNotExist:
            return Response(
                {'error': 'Application not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class DashboardStatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        apps = LoanApplication.objects.all()

        total     = apps.count()
        low       = apps.filter(risk_category='LOW').count()
        medium    = apps.filter(risk_category='MEDIUM').count()
        high      = apps.filter(risk_category='HIGH').count()
        very_high = apps.filter(risk_category='VERY_HIGH').count()

        return Response({
            'total_applications': total,
            'low_risk':           low,
            'medium_risk':        medium,
            'high_risk':          high,
            'very_high_risk':     very_high,
            'default_rate':       round((high + very_high) / total * 100, 2) if total > 0 else 0,
        })