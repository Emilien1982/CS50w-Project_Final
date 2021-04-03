# Generated by Django 3.1.6 on 2021-04-02 16:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('booking', '0004_auto_20210402_0939'),
    ]

    operations = [
        migrations.AlterField(
            model_name='datespecial',
            name='state',
            field=models.CharField(choices=[('O', 'Opened'), ('C', 'Closed')], default='C', max_length=1, null=True, verbose_name='The restaurant is: '),
        ),
    ]