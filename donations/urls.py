from django.urls import path, include
from . import views

app_name = 'donations'
urlpatterns = [
    path('', views.donations, name='donations_home'),
    path('new-donation/', views.new_donation, name='new_donation'),
]

