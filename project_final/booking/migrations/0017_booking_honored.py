# Generated by Django 3.1.6 on 2021-04-14 10:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('booking', '0016_auto_20210410_0858'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='honored',
            field=models.BooleanField(default=False),
        ),
    ]
