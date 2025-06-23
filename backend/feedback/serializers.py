from rest_framework import serializers
from .models import Feedback
class FeedbackSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.username', read_only=True)

    class Meta:
        model = Feedback
        fields = '__all__'
        read_only_fields = ['manager', 'created_at', 'updated_at']
        
    def get_employee_name(self, obj):
        return obj.employee.username 