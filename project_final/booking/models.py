from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass

class Table(models.Model):
    CAPACITY_CHOICES = [
        (2, "2"),
        (4, "8"),
        (6, "6"),
        (8, "8"),
        (10, "10"),
        (12, "12"),
        (14, "14")
    ]
    FORM_TYPE_CHOICES = [
        ("H", "High"),
        ("S", "Standard"),
        ("L", "Low")
    ]
    is_active = models.BooleanField(default=True)
    is_joker = models.BooleanField(default=False)
    is_for_disabled = models.BooleanField(default=False)
    refence = models.CharField(max_length=6, unique=True)
    capacity = models.IntegerField(
        choices=CAPACITY_CHOICES,
        default=2
    )
    form_type = models.CharField(
        max_length=1,
        choices=FORM_TYPE_CHOICES
    )
# Creer des modèles distinct pour les choix si on veut que les managers puissent les définir.
# Et créer les pages qui le permettent.

class Client(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50, blank=True)
    tel = models.CharField(max_length=21)
    is_foreign_phone = models.BooleanField(default=False)
    is_not_welcome = models.BooleanField(default=False)
    is_disabled = models.BooleanField(default=False)
    note = models.CharField(max_length=140, blank=True)

class DateClosed(models.Model):
    date = models.DateField()

class Booking(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="booker")
    tables = models.ManyToManyField(Table, related_name="booked")
    is_wanted_table = models.BooleanField(default=False)
    booking_date = models.DateTimeField(auto_now=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    creator = models.CharField(max_length=10)
    note = models.CharField(max_length=140, blank=True)
