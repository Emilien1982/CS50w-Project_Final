from django.shortcuts import render
from datetime import datetime, timedelta



# Create your views here.
def login(request):
    pass

def index(request):
    today = datetime.today()
    booking_end = today + timedelta(days=62)
    print(booking_end.strftime('%Y-%m-%d'))
    return render(request, "booking/index.html", {
        "today": today.strftime('%Y-%m-%d'),
        "booking_end": booking_end.strftime('%Y-%m-%d'),
    })

def deleted(request):
    pass

def booking(request):
    pass

def table(request):
    pass

def person(request):
    pass

def extra_date(request):
    pass

def staff(request):
    pass
