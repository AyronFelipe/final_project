# Generated by Django 2.0.1 on 2018-05-27 21:58

import core.utils
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0013_auto_20180523_1105'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='photo',
            field=models.ImageField(blank=True, null=True, upload_to=core.utils.img_path, verbose_name='photo'),
        ),
    ]