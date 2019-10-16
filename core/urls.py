from . import views
from django.urls import path


urlpatterns = [
    path('', views.home, name='home'),
    path('comments/', views.new_comments, name="new_comments")
]