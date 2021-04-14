from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt

from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.http import JsonResponse, HttpResponseForbidden, HttpResponseNotAllowed
from django.urls import reverse
from datetime import date, datetime, timedelta

import json
from django.core.serializers import serialize

from .models import User, Table, Client, WeekDayOpened, DateSpecial, Booking, Staff, TableForm, DateForm, StaffForm, ClientForm


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
            return HttpResponseRedirect(reverse("booking_list"))
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

def booking_search(request):
    return render(request, "booking/index.html", {
        "book_search_tab": True,
        "staffActive": Staff.objects.filter(is_active=True)
    })

def booking_list(request):
    today_obj = datetime.today().date()
    next_bookings = Booking.objects.filter(booking_date__gte=today_obj).order_by('booking_date', '-booking_time')
    # make a list of UNIQUE dates, to be able to iterate in the template and display the lunch / dinner button properly
    date_list = []
    current_date = ''
    for booking in next_bookings:
        temp = {
            'date': '',
            'lunch': False,
            'dinner': False
        }
        if booking.booking_date != current_date:
            temp['date'] = booking.booking_date
            current_date = booking.booking_date
            if booking.booking_time == 'lunch':
                temp['lunch'] = True
            if booking.booking_time == 'dinner':
                temp['dinner'] = True
            date_list.append(temp)
        else:
            if booking.booking_time == 'lunch':
                date_list[-1]['lunch'] = True
            if booking.booking_time == 'dinner':
                date_list[-1]['dinner'] = True

    return render(request, "booking/booking_list.html", {
        "date_list": date_list
    })

@login_required
def table(request):
    if request.method == "POST":
        table_form = TableForm(request.POST)
        if table_form.is_valid():
            table_form.save()
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
    return render(request, "booking/persons.html", {
        "person_tab": True,
        "client_form": ClientForm()
    })


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
        return  render(request, "booking/index.html", {
            "date_tab": True,
            "weekdays": WeekDayOpened.objects.all(),
            "dates": DateSpecial.objects.filter(date__gte=datetime.today()),
            "date_form": DateForm(),
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
    if delete_fct_return[0] >= 1:
        return HttpResponseRedirect(reverse("table"))
    else:
        return HttpResponse("The table hasn't been deleted", status=403)

@login_required
def date_delete(request, date_id):
    date_to_delete = DateSpecial.objects.get(pk=date_id)
    delete_fct_return = date_to_delete.delete()
    if delete_fct_return[0] >= 1:
        return HttpResponseRedirect(reverse("date_special"))
    else:
        return HttpResponse("The date hasn't been deleted", status=403)

@login_required
def staff_delete(request, staff_id):
    staff_to_delete = Staff.objects.get(pk=staff_id)
    delete_fct_return = staff_to_delete.delete()
    if delete_fct_return[0] >= 1:
        return HttpResponse(status=200)
    else:
        return HttpResponse("The date hasn't been deleted", status=403)


@login_required
@csrf_exempt
def booking_api(request):
    if request.method == 'POST':
        search_criteria = json.loads(request.body)
        
        area_list = []
        if search_criteria['area-ext']:
            area_list.append("EXT")
        if search_criteria['area-mai']:
            area_list.append("MAI")
        if search_criteria['area-up']:
            area_list.append("UP")

        table_height_list = []
        if search_criteria['table-low']:
            table_height_list.append("Low")
        if search_criteria['table-std']:
            table_height_list.append("Standard")
        if search_criteria['table-high']:
            table_height_list.append("High")


        start = date.today()
        end = start + timedelta(days=31)

        # 1/ get a list of special dates between start to end
        special_dates = DateSpecial.objects.filter(date__range=(start, end))

        # 2/ get the weekdays
        weekdays = WeekDayOpened.objects.all()

        # 3/ get the possible tables regarding the criteria
        possible_tables = Table.objects.filter(is_active=True).filter(is_joker=False).filter(area__in=area_list).filter(form_type__in=table_height_list).filter(capacity=int(search_criteria['capacity']))
        if search_criteria['disabled-access']:
            possible_tables = possible_tables.filter(is_for_disabled=True)
        #print(possible_tables)

        # 4/ get all the existing booking between start and end
        impossible_dates = Booking.objects.filter(booking_date__range=(start, end))
        print("IMPOSSIBLE", impossible_dates)

        # 5/ create a list that stores all possible dates between start to end
        possible_dates = []
        while start <= end:
            if start in special_dates.values_list('date', flat=True):
                ## if start is a special date, add it according the special date opened times
                d_day = special_dates.get(date=start)
                if d_day.at_lunch == search_criteria['time-lunch'] or d_day.at_dinner == search_criteria['time-dinner']:
                    possible_dates.append(
                            {"date": start,
                            "lunch": d_day.at_lunch,
                            "dinner": d_day.at_dinner,
                            "tables": list(possible_tables.values())
                            }
                    )
            else:
                ## get opened times regarding the weekdays 
                # get the week day of the date "start"
                start_day = start.strftime("%a").lower()
                # get the opened time(s) of the date "start"
                weekday = weekdays.filter(weekday=start_day)
                # add the date + time, according to the weekdays opened times
                if weekday[0].is_opened_lunch == search_criteria['time-lunch'] or weekday[0].is_opened_dinner == search_criteria['time-dinner']:
                    possible_dates.append(
                            {"date": start,
                            "lunch": weekday[0].is_opened_lunch,
                            "dinner":weekday[0].is_opened_dinner,
                            "tables": list(possible_tables.values())
                            }
                    )

            start += timedelta(days=1)

        #print("POSSIBLE", possible_dates)
        #### APRES AVOIR CREER DES BOOKINGS, RESTE A EXCLURE LES impossible_dates DE possible_dates, TABLE PAR TABLE


        # NE RENVOYER QU UN JSON AVEC TABLES ET DATES
        return JsonResponse(possible_dates, safe=False)
        #### APRES AVOIR CREER DES BOOKINGS, REVOIR SI possible_dates EST BIEN APPROPRIE
    else:
        return HttpResponseNotAllowed(['POST'])


@login_required
@csrf_exempt
def get_booking(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        bookings = Booking.objects.filter(booking_date=data['date'], booking_time=data['time']).select_related('client', 'table', 'creator').order_by('table__reference')
        bookings_list = list(bookings.values())
        #print(bookings_list)
        bookings_full = []
        for booking in bookings_list:
            client = bookings.get(pk=booking['id']).client
            booking['client_name'] = f'{client.first_name} {client.last_name}'
            booking['client_tel'] = client.tel
            booking['client_is_disabled'] = client.is_disabled

            table = bookings.get(pk=booking['id']).table
            booking['table_reference'] = table.reference
            booking['table_is_joker'] = table.is_joker
            booking['table_is_for_disabled'] = table.is_for_disabled
            booking['table_area'] = table.area
            booking['table_form_type'] = table.form_type

            creator = bookings.get(pk=booking['id']).creator
            booking['creator_short_name'] = creator.short_name

            bookings_full.append(booking)

        return  JsonResponse(bookings_full, safe=False)
    else:
        return HttpResponseNotAllowed(['POST'])




@login_required
@csrf_exempt
def booking_save_api(request):
    if request.method == 'POST':
        d = json.loads(request.body)
        booking_date = date(d['date'][0], d['date'][1], d['date'][2])
        # datetime.date() takes 3 args separate by a comma: year, month, day

        booking, is_created = Booking.objects.get_or_create(
            table = Table.objects.get(pk=d['table_id']),
            booking_date = booking_date,
            booking_time = d['time'],
            defaults = {
                'client': Client.objects.get(pk=d['client_id']),
                'is_wanted_table': d['table_locked'],
                'creator': Staff.objects.get(pk=d['booker_id']),
                'note': d['note']
            }
        )
        if is_created:
            return HttpResponse(status=200)
        else:
            return HttpResponseForbidden()

    else:
        return HttpResponseNotAllowed(['POST'])


@login_required
@csrf_exempt
def booking_delete(request, booking_id):
    booking = Booking.objects.get(pk=booking_id)
    fct_return = booking.delete()
    if fct_return[0] != 1:
        return HttpResponse(status=400)
    else:
        return HttpResponse(status=200)


@login_required
@csrf_exempt
def booking_honored(request, booking_id):
    booking = Booking.objects.get(pk=booking_id)
    #Toggle the honored boolean
    booking.honored = not booking.honored
    booking.save()
    return HttpResponse(status=200)


@login_required
@csrf_exempt
# Update or create the client from the booking form
def client_api(request):
    if request.method == 'POST':
        client_data = json.loads(request.body)
        client, created = Client.objects.update_or_create(
            tel=client_data['phone'],
            defaults={
                'first_name': client_data['first'],
                'last_name': client_data['last'],
                'is_foreign_phone': client_data['is_foreign_num']
            }
        )
        return JsonResponse(client.id, safe=False)
    else:
        return HttpResponseNotAllowed(['POST'])


@login_required
@csrf_exempt
# Update the client from the "person" page
def client_update_api(request):
    if request.method == 'POST':
        client_data = json.loads(request.body)
        # client_data contains 2 keys: 'id' and 'fields' (which contains as many keys as Client have fields)
        try:
            d = client_data['fields']
            Client.objects.filter(pk=client_data['id']).update(**d)
        except Client.DoesNotExist:
            return JsonResponse({"error": "Client not found."}, status=404)
    return HttpResponse(status=200)


@login_required
@csrf_exempt
# Get a list of client that match the search criteria
def easy_client_api(request, feature):
    if request.method == 'GET':
        # When using GET method, feature is the id of the wanted client
        client_id = int(feature)
        try:
            client = Client.objects.get(pk=client_id)
        except Client.DoesNotExist:
            return JsonResponse({"error": "Client not found."}, status=404)
        return JsonResponse(client.serialize())

    if request.method == 'POST':
        data = json.loads(request.body)
        matching_clients=''

        # matching_clients filters vary regarding the origin of request (determinated by the 'feature' fields)
        if feature == 'from_booking':
            matching_clients = Client.objects.filter(tel__startswith=data)
        if feature == 'search':
            matching_clients = Client.objects.filter(
                first_name__icontains=data['first_name'],
                last_name__icontains=data['last_name'],
                tel__icontains=data['tel']
            )
            # Checkbox are treated appart, this way their fields are filtered only if checked
            # That makes more sense when search for a client that we don't know all the details
            if data['is_foreign_phone']:
                matching_clients = matching_clients.filter(is_foreign_phone=True)
            if data['is_not_welcome']:
                matching_clients = matching_clients.filter(is_not_welcome=True)
            if data['is_disabled']:
                matching_clients = matching_clients.filter(is_disabled=True)

        # if the query is empty
        if len(matching_clients) == 0:
            return HttpResponse(status=204)
        
        # if the query has 1 or more results: transform the query as json then send it
        data = serialize('json', matching_clients)
        return HttpResponse(data, content_type="application/json")
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])

@login_required
@csrf_exempt
# Get a list of client that match the search criteria
def client_delete_api(request, client_id):
    client = Client.objects.get(pk=client_id)
    delete_fct_return = client.delete()
    if delete_fct_return[0] >= 1:
        return HttpResponse(status=200)
    else:
        return HttpResponse("The client hasn't been deleted", status=403)
