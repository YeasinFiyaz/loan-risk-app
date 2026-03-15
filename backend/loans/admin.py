from django.contrib import admin
from .models import LoanApplication


@admin.register(LoanApplication)
class LoanApplicationAdmin(admin.ModelAdmin):
    list_display  = [
        'id', 'full_name', 'loan_amnt', 'annual_inc',
        'risk_category', 'risk_score', 'submitted_at'
    ]
    list_filter   = ['risk_category', 'home_ownership', 'purpose', 'grade']
    search_fields = ['full_name']
    readonly_fields = ['risk_score', 'risk_category', 'submitted_at']
    ordering      = ['-submitted_at']