from django.db import models
from django.contrib.auth.models import AbstractUser
from django.forms import ModelForm


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
    ("H", "High"),
    ("S", "Standard"),
    ("L", "Low")
]

AREA_CHOICES = [
    ("UP", "Up Stair"),
    ("EXT", "Exterior"),
    ("MAI", "Main Room")
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
        max_length=1,
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
    tel = models.CharField(max_length=21)
    is_foreign_phone = models.BooleanField(default=False)
    is_not_welcome = models.BooleanField(default=False)
    is_disabled = models.BooleanField(default=False)
    note = models.CharField(max_length=140, blank=True)

    def __str__(self):
        return '%s %s' % (self.first_name, self.last_name)

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

## Forms

class TableForm(ModelForm):
    class Meta:
        model = Table
        fields = ['is_active', 'is_joker', 'is_for_disabled', 'area', 'reference', 'capacity', 'form_type']