# Generated by Django 2.0.1 on 2018-10-11 13:42

import cloudinary.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('donations', '0020_auto_20180910_1049'),
    ]

    operations = [
        migrations.AlterField(
            model_name='donation',
            name='main_photo',
            field=cloudinary.models.CloudinaryField(blank=True, max_length=255, null=True, verbose_name='main photo'),
        ),
    ]