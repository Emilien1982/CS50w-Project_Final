# Generated by Django 3.1.6 on 2021-04-04 14:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('booking', '0008_auto_20210403_1743'),
    ]

    operations = [
        migrations.CreateModel(
            name='Staff',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_active', models.BooleanField(default=True)),
                ('first_name', models.CharField(max_length=20)),
                ('last_name', models.CharField(max_length=20)),
                ('short_name', models.CharField(max_length=5)),
                ('position', models.CharField(blank=True, choices=[('waiter', 'waiter'), ('barman', 'barman'), ('chef', 'chef'), ('kitchen aid', 'kitchen aid'), ('supervisor', 'supervisor'), ('manager', 'manager'), ('owner', 'owner')], max_length=15)),
            ],
        ),
        migrations.AlterField(
            model_name='datespecial',
            name='state',
            field=models.CharField(choices=[('Open', 'Opened'), ('Close', 'Closed')], default='Close', max_length=5, verbose_name='The restaurant is'),
        ),
    ]
