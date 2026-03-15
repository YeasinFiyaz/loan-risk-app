from rest_framework import serializers
from .models import LoanApplication


class LoanApplicationSerializer(serializers.ModelSerializer):

    class Meta:
        model  = LoanApplication
        fields = '__all__'
        read_only_fields = ['risk_score', 'risk_category', 'submitted_at']


class LoanApplicationListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing all applications."""

    class Meta:
        model  = LoanApplication
        fields = [
            'id',
            'full_name',
            'loan_amnt',
            'annual_inc',
            'purpose',
            'grade',
            'risk_score',
            'risk_category',
            'submitted_at',
        ]