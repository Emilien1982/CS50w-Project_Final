from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt

from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from datetime import datetime, timedelta
import json

from .models import User, Table, Client, WeekDayOpened, DateSpecial, Booking, Staff, TableForm, DateForm, StaffForm


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

def booking_search(request):
    return render(request, "booking/index.html", {
        "book_search_tab": True,
    })

def booking_list(request):
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
            "table_tab": True,
            "tables": tables,
            "table_form": table_form,
            # pass tables data as JSON format for javascript usage (when editing table for example)
            "tables_data": json.dumps(list(tables.values()))
        })


def person(request):
    pass


@login_required
def date_special(request):
    if request.method == 'POST':
        start = datetime.strptime(request.POST['date'], '%Y-%m-%d')
        end = datetime.strptime(request.POST['date_end'], '%Y-%m-%d')
        # Basic checks
        if start < datetime.today():
            #REVENIR SUR LA GESTION DES ERREURS (RENVOYER PLUTOT VERS LA PAGE AVEC UN MESSAGE D ERROR)
            return HttpResponse("You can't add a date earlier than today", status=403)
        if start > end:
            return HttpResponse("You can't provide a end date earlier than start date", status=403)
        fields_list = request.POST.keys()
        if not 'at_lunch' in fields_list and not 'at_dinner' in fields_list:
            return HttpResponse("Lunch and Dinner checkboxes can't be both unchecked at the same time", status=403)

        # Deal with a period (start to end) if applicable
        if request.POST['period'] == "no":
            # if single date, set the end equal start to run the while loop only once
            end=start

        problem_happened=False
        delta = timedelta(days=1)
        while start <= end:
            # Create ou Update the start date
            date_temp, created = DateSpecial.objects.get_or_create(date=start)
            date_detailed = DateForm(request.POST, instance=date_temp)
            if date_detailed.is_valid():
                date_detailed.save()
            else:
                problem_happened=True
            start += delta
        if problem_happened:
            return HttpResponse("Something gone wrong", status=403)
        return HttpResponseRedirect(reverse("date_special"))

    else:
        date_form = DateForm()
        return  render(request, "booking/index.html", {
            "date_tab": True,
            "weekdays": WeekDayOpened.objects.all(),
            "dates": DateSpecial.objects.filter(date__gte=datetime.today()),
            "date_form": date_form,
            "today": datetime.today()
        })


def staff(request):
    if request.method == "POST":
        if "staff_id" in request.POST:
            old_staff = Staff.objects.get(pk=request.POST['staff_id'])
            new_staff = StaffForm(request.POST, instance=old_staff)
        else:
            new_staff = StaffForm(request.POST)
        if new_staff.is_valid():
            new_staff.save()
            return HttpResponseRedirect(reverse('staff'))
        else:
            return HttpResponse('Something gone wrong with the submited staff', status=403)
    else:
        return render(request, "booking/index.html", {
            "staff_tab": True,
            "staffs": Staff.objects.all().order_by('position', 'last_name'),
            "staff_form": StaffForm()
        })



########################## API #################################
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

@login_required
def date_delete(request, date_id):
    date_to_delete = DateSpecial.objects.get(pk=date_id)
    delete_fct_return = date_to_delete.delete()
    if delete_fct_return[0] == 1:
        return HttpResponseRedirect(reverse("date_special"))
    else:
        return HttpResponse("The date hasn't been deleted", status=403)

@login_required
def staff_delete(request, staff_id):
    staff_to_delete = Staff.objects.get(pk=staff_id)
    delete_fct_return = staff_to_delete.delete()
    if delete_fct_return[0] == 1:
        HttpResponse(status=200)
    else:
        return HttpResponse("The date hasn't been deleted", status=403)


@login_required
@csrf_exempt
def booking_api(request):
    if request.method == 'POST':
        search_criteria = json.loads(request.body)
        ## First make sure 
        
        print(search_criteria)
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=403)
