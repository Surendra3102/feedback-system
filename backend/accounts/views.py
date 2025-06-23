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
    
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User, EmployeeInfo, ManagerInfo
from rest_framework import status

@permission_classes([AllowAny])
class RegisterView(APIView):

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
                EmployeeInfo.objects.get(emp_id=emp_id)
            except EmployeeInfo.DoesNotExist:
                return Response({"error": "Invalid Employee ID."}, status=400)

            user = User(username=username, email=email, role="employee")
            user.set_password(password)
            user.save()
            return Response({"success": "Employee registered."}, status=201)

        elif role == 'manager':
            manager_id = data.get("manager_id", "").strip().upper()
            if not manager_id:
                return Response({"error": "Manager ID is required."}, status=400)

            try:
                ManagerInfo.objects.get(manager_id=manager_id)
            except ManagerInfo.DoesNotExist:
                return Response({"error": "Invalid Manager ID."}, status=400)

            user = User(username=username, email=email, role="manager")
            user.set_password(password)
            user.save()
            return Response({"success": "Manager registered."}, status=201)
