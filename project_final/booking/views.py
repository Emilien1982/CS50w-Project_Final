from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from datetime import datetime, timedelta
from json import dumps

from .models import User, Table, Client, WeekDayOpened, DateSpecial, Booking, TableForm, DateForm


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
    return render(request, "booking/index.html", {
        "today": datetime.today(),
        "booking_end": datetime.today() + timedelta(days=62)
    })

def deleted(request):
    pass

def booking(request):
    return render(request, "booking/index.html")

@login_required
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

@login_required
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

@login_required
def table_delete(request, table_id):
    table_to_delete = Table.objects.get(pk=table_id)
    delete_fct_return = table_to_delete.delete()
    if delete_fct_return[0] == 1:
        return HttpResponseRedirect(reverse("table"))
    else:
        return HttpResponse("The table hasn't been deleted", status=403)

def person(request):
    pass

@login_required
def weekday_update(request):
    if request.method == 'POST':
        weekday_form_data = request.POST
        # starting with a weekdays variable with every time set to False
        # because the POST request only include checked box, unchecked ones are don't appear in the POST data
        weekdays = {
            'mon': {'lun': False, 'din': False},
            'tue': {'lun': False, 'din': False},
            'wed': {'lun': False, 'din': False},
            'thu': {'lun': False, 'din': False},
            'fri': {'lun': False, 'din': False},
            'sat': {'lun': False, 'din': False},
            'sun': {'lun': False, 'din': False}
        }
        # Update the weekdays variable with the data from the POST request
        for field in weekday_form_data:
            if len(field) == 7 and weekday_form_data[field] == 'on':
                day = field[:3]
                time = field[4:]
                weekdays[day][time] = True

        # iterate over the weekdays variable to update the database. Using the existing instance of each days.
        for day in weekdays:
            #day_instance = WeekDayOpened.objects.get_or_create(weekday=day)
            #Use the above line (instead of the line above) if the database is empty
            day_instance = WeekDayOpened.objects.get(weekday=day)
            day_instance.is_opened_lunch = weekdays[day]['lun']
            day_instance.is_opened_dinner = weekdays[day]['din']
            day_instance.save()

        return HttpResponseRedirect(reverse("date_special"))
    else:
        return HttpResponse("Wrong method.", status=400)

@login_required
def date_special(request):
    date_form = DateForm()
    #today = datetime.today()
    return  render(request, "booking/index.html", {
        "weekdays": WeekDayOpened.objects.all(),
        "dates": DateSpecial.objects.filter(date__gte=datetime.today()),
        "date_form": date_form,
        "today": datetime.today()
    })

def staff(request):
    pass
