from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.donations, name='donations-home'),
]

