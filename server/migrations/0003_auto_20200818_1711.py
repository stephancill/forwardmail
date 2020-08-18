# Generated by Django 3.1 on 2020-08-18 17:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0002_alias'),
    ]

    operations = [
        migrations.AlterField(
            model_name='alias',
            name='proxy_address',
            field=models.EmailField(max_length=254, unique=True, verbose_name='alias address'),
        ),
    ]