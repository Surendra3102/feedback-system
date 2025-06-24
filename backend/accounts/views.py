from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, EmployeeInfoSerializer
from rest_framework.generics import ListAPIView

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


from .models import EmployeeInfo
class EmployeeListView(ListAPIView):
    serializer_class = EmployeeInfoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return EmployeeInfo.objects.all()

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from accounts.models import User, EmployeeInfo, ManagerInfo

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        username = data.get("username", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "")
        role = data.get("role", "").strip().lower()

        if role not in ['employee', 'manager']:
            return Response({"error": "Invalid role."}, status=400)

        if not username or not password:
            return Response({"error": "Username and password are required."}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists."}, status=400)

        if role == 'employee':
            emp_id = data.get("emp_id", "").strip().upper()
            if not emp_id:
                return Response({"error": "Employee ID is required."}, status=400)

            try:
                emp_info = EmployeeInfo.objects.get(emp_id=emp_id)
            except EmployeeInfo.DoesNotExist:
                return Response({"error": "Invalid Employee ID."}, status=400)

            # Check if already registered
            if emp_info.user is not None:
                return Response({"error": "This Employee ID is already registered."}, status=400)

            # Create user and link to EmployeeInfo
            user = User(username=username, email=emp_info.email, role="employee")
            user.set_password(password)
            user.save()

            emp_info.user = user
            emp_info.save()

            return Response({"success": "Employee registered successfully."}, status=201)

        elif role == 'manager':
            manager_id = data.get("manager_id", "").strip().upper()
            if not manager_id:
                return Response({"error": "Manager ID is required."}, status=400)

            try:
                manager_info = ManagerInfo.objects.get(manager_id=manager_id)
            except ManagerInfo.DoesNotExist:
                return Response({"error": "Invalid Manager ID."}, status=400)

            if manager_info.user is not None:
                return Response({"error": "This Manager ID is already registered."}, status=400)

            user = User(username=username, email=manager_info.email, role="manager")
            user.set_password(password)
            user.save()

            manager_info.user = user
            manager_info.save()

            return Response({"success": "Manager registered successfully."}, status=201)
