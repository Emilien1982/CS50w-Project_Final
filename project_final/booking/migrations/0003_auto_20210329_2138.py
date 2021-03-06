# Generated by Django 3.1.6 on 2021-03-29 21:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('booking', '0002_auto_20210327_1456'),
    ]

    operations = [
        migrations.AlterField(
            model_name='table',
            name='capacity',
            field=models.IntegerField(choices=[(2, '2'), (4, '4'), (6, '6'), (8, '8'), (10, '10'), (12, '12'), (14, '14')], default=2),
        ),
        migrations.AlterField(
            model_name='table',
            name='form_type',
            field=models.CharField(choices=[('H', 'High'), ('S', 'Standard'), ('L', 'Low')], max_length=1, verbose_name='Table height'),
        ),
        migrations.AlterField(
            model_name='table',
            name='reference',
            field=models.CharField(help_text='enter 6 characters max', max_length=6, unique=True),
        ),
    ]
