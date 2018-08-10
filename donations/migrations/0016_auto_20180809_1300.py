# Generated by Django 2.0.1 on 2018-08-09 16:00

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('donations', '0015_auto_20180716_1236'),
    ]

    operations = [
        migrations.AlterField(
            model_name='solicitation',
            name='owner',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='owner_solicitations', to=settings.AUTH_USER_MODEL),
        ),
    ]
