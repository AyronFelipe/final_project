# Generated by Django 2.0.1 on 2019-09-12 12:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0011_comment'),
        ('demands', '0008_donationtags'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='DonationTags',
            new_name='DemandTags',
        ),
    ]
