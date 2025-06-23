from rest_framework import serializers
from .models import Feedback
from accounts.models import EmployeeInfo

class FeedbackSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.name', read_only=True)
    emp_id = serializers.CharField(source='employee.emp_id', read_only=True)

    class Meta:
        model = Feedback
        fields = '__all__'
        read_only_fields = ['manager', 'created_at', 'updated_at']
