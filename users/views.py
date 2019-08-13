from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken

from django.contrib.auth import get_user_model

from .serializers import UserSerializer

User = get_user_model()


class Registration(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = []
    authentication_classes = []
    queryset = User.objects.all()

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)

            return Response(
                {
                    'user': UserSerializer(instance=user).data,
                    'token': token.key
                },
                status=201)
        else:
            return Response(serializer.errors, status=400)


class GetCurrentUser(APIView):
    serializer_class = UserSerializer

    def get(self, request):
        return Response(UserSerializer(instance=self.request.user).data)


class Login(ObtainAuthToken):
    permission_classes = []
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = User.objects.get(email__iexact=email)
            if not user.check_password(password):
                user = None
        except User.DoesNotExist:
            user = None

        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response(
                {
                    'user': UserSerializer(instance=user).data,
                    'token': token.key
                },
                status=200)
        else:
            return Response(
                {'non_field_errors': ["User does not exist."]},
                status=404)
