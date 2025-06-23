from rest_framework import viewsets, permissions
from .models import Feedback
from .serializers import FeedbackSerializer
from accounts.permissions import IsManager, IsEmployee
from rest_framework.exceptions import PermissionDenied

class FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'manager':
            return Feedback.objects.filter(manager=user)
        elif user.role == 'employee':
            return Feedback.objects.filter(employee=user)
        return Feedback.objects.none()

    def perform_create(self, serializer):
        if self.request.user.role != 'manager':
            raise PermissionDenied("Only managers can create feedback.")
        serializer.save(manager=self.request.user)

    def perform_update(self, serializer):
        instance = self.get_object()
        user = self.request.user
        # Manager updates their own feedback
        if user.role == 'manager' and instance.manager == user:
            serializer.save()
        # Employee can acknowledge or comment only on their own feedback
        elif user.role == 'employee' and instance.employee == user:
            serializer.save(
                manager=instance.manager,  # prevent override
                strengths=instance.strengths,
                improvements=instance.improvements,
                sentiment=instance.sentiment,
                tags=instance.tags
            )
        else:
            raise PermissionDenied("You do not have permission to update this feedback.")
