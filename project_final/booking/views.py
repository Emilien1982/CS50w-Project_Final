from django.shortcuts import render
from datetime import datetime, timedelta



# Create your views here.
def index(request):
    today = datetime.today()
    booking_end = today + timedelta(days=62)
    print(booking_end.strftime('%Y-%m-%d'))
    return render(request, "booking/index.html", {
        "today": today.strftime('%Y-%m-%d'),
        "booking_end": booking_end.strftime('%Y-%m-%d'),
    })