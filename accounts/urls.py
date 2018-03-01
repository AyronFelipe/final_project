from django.urls import path, include
from . import views

urlpatterns = [
    path('login/', views.login, name='accounts-login'),
    path('new-person', views.new_person, name='new-person'),
    path('new-institution', views.new_institution, name='new-institution'),
]


