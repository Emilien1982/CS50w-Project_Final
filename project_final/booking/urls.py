from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('login', views.login, name="login"),
    path('deleted', views.deleted, name="deleted"),
    path('booking', views.booking, name="booking")



    # API Routes

]
