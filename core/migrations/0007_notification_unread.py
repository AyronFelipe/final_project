# Generated by Django 2.0.1 on 2018-09-18 12:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_auto_20180712_0031'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='unread',
            field=models.BooleanField(default=True, verbose_name='unread'),
        ),
    ]
