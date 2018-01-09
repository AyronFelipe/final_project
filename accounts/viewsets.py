from rest_framework import viewsets
from rest_framework import generics
from .models import User, Person
from .serializers import UserSerializer, PersonSerializer


class UserViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = User.objects.all()
    serializer_class = UserSerializer


class PersonViewSet(generics.ListCreateAPIView):

    queryset = Person.objects.all()
    serializer_class = PersonSerializer


