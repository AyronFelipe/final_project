# Generated by Django 2.0.1 on 2018-01-09 20:05

import accounts.managers
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_remove_user_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Person',
            fields=[
                ('user_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('phone', models.CharField(blank=True, max_length=13, null=True, verbose_name='phone')),
                ('cell_phone', models.CharField(blank=True, max_length=14, null=True, verbose_name='cell_phone')),
                ('first_name', models.CharField(blank=True, max_length=255, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=255, verbose_name='last name')),
                ('cpf', models.CharField(max_length=14, verbose_name='cpf')),
                ('birthday', models.DateTimeField(blank=True, verbose_name='birthday')),
            ],
            options={
                'verbose_name_plural': 'persons',
                'verbose_name': 'person',
            },
            bases=('accounts.user', models.Model),
            managers=[
                ('objects', accounts.managers.UserManager()),
            ],
        ),
    ]
