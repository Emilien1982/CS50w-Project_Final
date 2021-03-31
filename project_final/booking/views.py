from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from datetime import datetime, timedelta
from json import dumps

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
            print("JUST BEFORE RELOAD")
            return HttpResponseRedirect(reverse("table"))
        else:
            print("table_form is not valid!")
            return HttpResponse('transmited data are invalid', status=403)
    else:
        tables = Table.objects.all().order_by('area', 'reference')
        table_form = TableForm()

        return render(request, "booking/index.html", {
            "tables": tables,
            "table_form": table_form,
            # pass tables data as JSON format for javascript usage (when editing table for example)
            "tables_data": dumps(list(tables.values()))
        })

def table_update(request, table_id):
    if request.method == "POST":
        table_old = Table.objects.get(pk=table_id)
        table_updated = TableForm(request.POST, instance=table_old)
        if table_updated.is_valid():
            table_updated.save()
            return HttpResponseRedirect(reverse("table"))
        else:
            print("transmited data are invalid")
            return HttpResponse('transmited data are invalid', status=403)
    else:
        return HttpResponse(status=405)

def person(request):
    pass

def extra_date(request):
    pass

def staff(request):
    pass
