# Generated by Django 3.1 on 2020-08-21 16:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0006_auto_20200820_2336'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='is_verified',
        ),
    ]
