from django.urls import path, include
from . import views

app_name = 'donations'
urlpatterns = [
    path('', views.donations, name='donations_home'),
    path('new-donation/', views.new_donation, name='new_donation'),
    path('donation/<slug>/', views.donation_detail, name='donation_detail'),
    path('my-solicitations/', views.my_solicitations, name='my_solicitations'),
    path('my-donations/', views.my_donations, name='my_donations'),
    path('<slug>/solicitations/', views.solicitations_donation, name='solicitations_donation')
]

