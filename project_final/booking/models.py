from django.db import models
from django.contrib.auth.models import AbstractUser
from django.forms import ModelForm
from django import forms


CAPACITY_CHOICES = [
    (2, "2"),
    (4, "4"),
    (6, "6"),
    (8, "8"),
    (10, "10"),
    (12, "12"),
    (14, "14")
]
FORM_TYPE_CHOICES = [
    ("High", "High"),
    ("Standard", "Standard"),
    ("Low", "Low")
]

AREA_CHOICES = [
    ("UP", "Up Stair"),
    ("EXT", "Exterior"),
    ("MAI", "Main Room")
]


POSITION_CHOICES = [
    ("waiter", "waiter"),
    ("barman", "barman"),
    ("chef", "chef"),
    ("kitchen aid", "kitchen aid"),
    ("supervisor", "supervisor"),
    ("manager", "manager"),
    ("owner", "owner")
]

WEEKDAY_CHOICES = [
    ("mon", "Monday"),
    ("tue", "Tuesday"),
    ("wed", "Wednesday"),
    ("thu", "Thursday"),
    ("fri", "Friday"),
    ("sat", "Saturday"),
    ("sun", "Sunday"),
]

TIME_CHOICES = [
    ("lunch", "lunch"),
    ("diner", "diner")
]

## Models

class User(AbstractUser):
    pass

class Table(models.Model):
    is_active = models.BooleanField(default=True)
    is_joker = models.BooleanField(default=False)
    is_for_disabled = models.BooleanField(default=False)
    reference = models.CharField(max_length=6, unique=True, help_text="enter 6 characters max")
    area = models.CharField(
        max_length=3,
        choices=AREA_CHOICES,
        default="MAI"
    )
    capacity = models.IntegerField(
        choices=CAPACITY_CHOICES,
        default=2
    )
    form_type = models.CharField(
        max_length=10,
        choices=FORM_TYPE_CHOICES,
        verbose_name="Table height"
    )
    def __str__(self):
        return self.reference
# Creer des modèles distinct pour les choix si on veut que les managers puissent les définir.
# Et créer les pages qui le permettent.

class Client(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50, blank=True)
    tel = models.CharField(max_length=21, unique=True)
    is_foreign_phone = models.BooleanField(default=False)
    is_not_welcome = models.BooleanField(default=False)
    is_disabled = models.BooleanField(default=False)
    note = models.CharField(max_length=140, blank=True)

    def __str__(self):
        return '%s %s' % (self.first_name, self.last_name)

class WeekDayOpened(models.Model):
    weekday = models.CharField(
        max_length=3,
        choices=WEEKDAY_CHOICES,
        unique=True
    )
    is_opened_lunch = models.BooleanField(default=False)
    is_opened_dinner = models.BooleanField(default=False)

class DateSpecial(models.Model):
    date = models.DateField(unique=True)
    at_lunch = models.BooleanField(default=True)
    at_dinner = models.BooleanField(default=True)

class Staff(models.Model):
    is_active = models.BooleanField(default=True)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    short_name = models.CharField(max_length=5)
    position = models.CharField(
        max_length=15,
        choices=POSITION_CHOICES,
        blank=True
    )

class Booking(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="booker")
    table = models.ForeignKey(Table, on_delete=models.CASCADE, null=True, related_name="booked_table")
    is_wanted_table = models.BooleanField(default=False)
    booking_date = models.DateField()
    booking_time = models.CharField(
        max_length=5,
        choices=TIME_CHOICES,
        default="lunch"
    )
    creation_date = models.DateTimeField(auto_now=True)
    creator = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True, blank=True)
    note = models.CharField(max_length=140, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['table', 'booking_date', 'booking_time'], name='unique_date_time_table')
        ]

## Forms

class TableForm(ModelForm):
    class Meta:
        model = Table
        fields = ['is_active', 'is_joker', 'is_for_disabled', 'area', 'reference', 'capacity', 'form_type']


class DateForm(ModelForm):
    class Meta:
        model = DateSpecial
        exclude = ['date']


class StaffForm(ModelForm):
    class Meta:
        model = Staff
        fields = '__all__'
