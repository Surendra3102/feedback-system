from django.db import models
from accounts.models import User, EmployeeInfo

class Feedback(models.Model):
    SENTIMENT_CHOICES = (
        ('positive', 'Positive'),
        ('negative', 'Negative'),
        ('neutral', 'Neutral'),
    )

    manager = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedbacks')
    employee = models.ForeignKey(EmployeeInfo, on_delete=models.CASCADE, related_name='feedbacks')
    strengths = models.TextField()
    improvements = models.TextField()
    sentiment = models.CharField(max_length=10, choices=SENTIMENT_CHOICES, default='neutral')
    tags = models.CharField(max_length=100, blank=True)
    acknowledged = models.BooleanField(default=False)
    employee_comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)