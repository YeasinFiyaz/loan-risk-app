from django.urls import path
from .views import (
    SubmitApplicationView,
    ApplicationListView,
    ApplicationDetailView,
    DashboardStatsView,
)

urlpatterns = [
    path('apply/',                 SubmitApplicationView.as_view(),  name='apply'),
    path('applications/',          ApplicationListView.as_view(),    name='applications'),
    path('applications/<int:pk>/', ApplicationDetailView.as_view(),  name='application-detail'),
    path('dashboard/stats/',       DashboardStatsView.as_view(),     name='dashboard-stats'),
]