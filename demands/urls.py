from django.urls import path, include
from . import views

app_name = 'demands'
urlpatterns = [
    path('new-demand/', views.new_demand, name='new_demand'),
]

