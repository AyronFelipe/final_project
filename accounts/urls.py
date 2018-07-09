from django.urls import path, include
from . import views

app_name = 'accounts'
urlpatterns = [
    path('login/', views.login, name='accounts_login'),
    path('new-person/', views.new_person, name='new_person'),
    path('new-institution/', views.new_institution, name='new_institution'),
    path('activate/<uidb64>/<token>/', views.activate, name='activate'),
    path('profile/<int:id>/', views.profile, name='profile'),
]


