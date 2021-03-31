from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('login', views.login_view, name="login"),
    path('logout', views.logout_view, name="logout"),
    path('deleted', views.deleted, name="deleted"),
    path('booking', views.booking, name="booking"),
    path('table', views.table, name="table"),
    path('table/<int:table_id>', views.table_update, name="table_update"),
    path('person', views.person, name="person"),
    path('extra_date', views.extra_date, name="extra_date"),
    path('staff', views.staff, name="staff")

    # API Routes

]
