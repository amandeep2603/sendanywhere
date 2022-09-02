from .views import *
from django.urls import path

urlpatterns=[
    path('uploadfile/', uploadfile , name="upload files"),
    path('deletefile/<str:pk>/', deletefile , name="delete files"),
    path('downloadfile/<str:pk>/', downloadfile , name="download files"),
]