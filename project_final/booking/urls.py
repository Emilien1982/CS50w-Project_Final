from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('login', views.login_view, name="login"),
    path('logout', views.logout_view, name="logout"),
    path('deleted', views.deleted, name="deleted"),
    path('booking', views.booking, name="booking"),
    path('table', views.table, name="table"),
    path('person', views.person, name="person"),
    path('date_special', views.date_special, name="date_special"),
    path('staff', views.staff, name="staff"),

    # API Routes
    path('table/<int:table_id>', views.table_update, name="table_update"),
    path('table_delete/<int:table_id>', views.table_delete, name="table_delete"),
    path('weekday_update', views.weekday_update, name="weekday_update"),
    path('date_detete/<int:date_id>', views.date_delete, name="date_delete")
]
