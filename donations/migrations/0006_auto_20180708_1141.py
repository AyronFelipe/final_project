# Generated by Django 2.0.1 on 2018-07-08 14:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('donations', '0005_auto_20180621_1221'),
    ]

    operations = [
        migrations.AlterField(
            model_name='donation',
            name='name',
            field=models.CharField(max_length=255),
        ),
    ]
