from rest_framework import serializers
from .models import User, EmployeeInfo

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            role=validated_data['role'],
        )
        user.set_password(validated_data['password'])  # 🔐 hash the password
        user.save()
        return user

class EmployeeInfoSerializer(serializers.ModelSerializer):
    user_id = serializers.SerializerMethodField()

    class Meta:
        model = EmployeeInfo
        fields = ['id', 'emp_id', 'name', 'user_id']

    def get_user_id(self, obj):
        try:
            return User.objects.get(email=obj.email, role='employee').id
        except User.DoesNotExist:
            return None
