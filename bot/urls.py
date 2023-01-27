from django.urls import path
from . import views

urlpatterns = [
    path('', views.bot_view, name='bot_view'),
]
