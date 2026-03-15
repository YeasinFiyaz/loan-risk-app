from django.db import models


class LoanApplication(models.Model):

    RISK_CHOICES = [
        ('LOW',       'Low Risk'),
        ('MEDIUM',    'Medium Risk'),
        ('HIGH',      'High Risk'),
        ('VERY_HIGH', 'Very High Risk'),
    ]

    HOME_OWNERSHIP_CHOICES = [
        ('RENT',     'Rent'),
        ('OWN',      'Own'),
        ('MORTGAGE', 'Mortgage'),
        ('OTHER',    'Other'),
    ]

    PURPOSE_CHOICES = [
        ('debt_consolidation',  'Debt Consolidation'),
        ('credit_card',         'Credit Card'),
        ('home_improvement',    'Home Improvement'),
        ('other',               'Other'),
        ('major_purchase',      'Major Purchase'),
        ('medical',             'Medical'),
        ('small_business',      'Small Business'),
        ('car',                 'Car'),
        ('vacation',            'Vacation'),
        ('moving',              'Moving'),
        ('house',               'House'),
        ('wedding',             'Wedding'),
        ('educational',         'Educational'),
        ('renewable_energy',    'Renewable Energy'),
    ]

    # -- Applicant Info -------------------------------------------------------
    full_name        = models.CharField(max_length=200)
    loan_amnt        = models.FloatField(help_text='Loan amount requested')
    annual_inc       = models.FloatField(help_text='Annual income')
    installment      = models.FloatField(help_text='Monthly installment')
    emp_length       = models.FloatField(help_text='Employment length in years')
    home_ownership   = models.CharField(max_length=20, choices=HOME_OWNERSHIP_CHOICES)
    purpose          = models.CharField(max_length=50, choices=PURPOSE_CHOICES)
    grade            = models.CharField(max_length=2, help_text='Loan grade A-G')
    dti              = models.FloatField(help_text='Debt to income ratio')
    delinq_2yrs      = models.FloatField(default=0, help_text='Delinquencies in last 2 years')
    open_acc         = models.FloatField(help_text='Number of open accounts')
    pub_rec          = models.FloatField(default=0, help_text='Public records')
    revol_bal        = models.FloatField(help_text='Revolving balance')
    revol_util       = models.FloatField(help_text='Revolving utilization rate')
    total_acc        = models.FloatField(help_text='Total accounts')
    mort_acc         = models.FloatField(default=0, help_text='Mortgage accounts')
    pub_rec_bankruptcies = models.FloatField(default=0, help_text='Bankruptcies')

    # -- Prediction Results ---------------------------------------------------
    risk_score       = models.FloatField(null=True, blank=True)
    risk_category    = models.CharField(max_length=20, choices=RISK_CHOICES, blank=True)
    submitted_at     = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.risk_category} ({self.risk_score})"

    class Meta:
        ordering = ['-submitted_at']