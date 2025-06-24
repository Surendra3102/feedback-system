from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Feedback
from .serializers import FeedbackSerializer
from accounts.models import EmployeeInfo

class FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'manager':
            return Feedback.objects.filter(manager=user)
        elif user.role == 'employee':
            try:
                emp_info = EmployeeInfo.objects.get(user=user)
                return Feedback.objects.filter(employee=emp_info)
            except EmployeeInfo.DoesNotExist:
                return Feedback.objects.none()
        return Feedback.objects.none()

    def perform_create(self, serializer):
        if self.request.user.role != 'manager':
            raise PermissionDenied("Only managers can create feedback.")
        serializer.save(manager=self.request.user)

    def perform_update(self, serializer):
        instance = self.get_object()
        user = self.request.user

        if user.role == 'manager' and instance.manager == user:
            serializer.save()
        elif user.role == 'employee' and instance.employee.user_id == user.id:
            serializer.save(
                manager=instance.manager,
                employee=instance.employee,
                strengths=instance.strengths,
                improvements=instance.improvements,
                sentiment=instance.sentiment,
                tags=instance.tags
            )
        else:
            raise PermissionDenied("You do not have permission to update this feedback.")
