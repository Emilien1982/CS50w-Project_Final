from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('login', views.login_view, name="login"),
    path('logout', views.logout_view, name="logout"),
    path('booking_search', views.booking_search, name="booking_search"),
    path('booking_list', views.booking_list, name="booking_list"),
    path('table', views.table, name="table"),
    path('person', views.person, name="person"),
    path('date_special', views.date_special, name="date_special"),
    path('staff', views.staff, name="staff"),

    # API Routes
    path('table/<int:table_id>', views.table_update, name="table_update"),
    path('table_delete/<int:table_id>', views.table_delete, name="table_delete"),
    path('weekday_update', views.weekday_update, name="weekday_update"),
    path('date_detete/<int:date_id>', views.date_delete, name="date_delete"),
    path('staff_delete/<int:staff_id>', views.staff_delete, name="staff_delete"),
    path('booking_api', views.booking_api, name="booking_api"),
    path('booking_save_api', views.booking_save_api),
    path('get_booking', views.get_booking),
    path('booking_delete/<int:booking_id>', views.booking_delete),
    path('booking_honored/<int:booking_id>', views.booking_honored),
    path('booking_conflits', views.booking_conflits),
    path('client_api', views.client_api, name="client_api"),
    path('easy_client/<str:feature>', views.easy_client_api),
    path('client_update_api', views.client_update_api),
    path('client_delete_api/<int:client_id>', views.client_delete_api)
    
]
