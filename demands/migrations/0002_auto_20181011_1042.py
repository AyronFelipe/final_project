# Generated by Django 2.0.1 on 2018-10-11 13:42

import cloudinary.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('demands', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='demand',
            name='main_photo',
            field=cloudinary.models.CloudinaryField(blank=True, max_length=255, null=True, verbose_name='main photo'),
        ),
    ]
