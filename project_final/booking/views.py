from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from datetime import datetime, timedelta

from .models import User, Table, Client, DateClosed, Booking, TableForm


# Create your views here.
def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("booking"))
        else:
            return render(request, "booking/login.html", {
                "message": "Invalid email and/or password."
            })
    else :
        return render(request, "booking/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def index(request):
    today = datetime.today()
    booking_end = today + timedelta(days=62)
    return render(request, "booking/index.html", {
        "today": today.strftime('%Y-%m-%d'),
        "booking_end": booking_end.strftime('%Y-%m-%d'),
    })

def deleted(request):
    pass

def booking(request):
    return render(request, "booking/index.html")

def table(request):
    if request.method == "POST":
        table_form = TableForm(request.POST)
        if table_form.is_valid():
            table_form.save()
            return HttpResponseRedirect(reverse("table"))
        else:
            print("table_form is not valid!")
    else:
        tables = Table.objects.all().order_by('area', 'reference')
        table_form = TableForm()

        return render(request, "booking/index.html", {
            "tables": tables,
            "table_form": table_form
        })

def person(request):
    pass

def extra_date(request):
    pass

def staff(request):
    pass
