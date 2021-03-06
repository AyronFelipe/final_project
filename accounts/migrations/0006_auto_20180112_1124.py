# Generated by Django 2.0.1 on 2018-01-12 14:24

import accounts.managers
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_auto_20180109_1756'),
    ]

    operations = [
        migrations.CreateModel(
            name='Institution',
            fields=[
                ('user_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('phone', models.CharField(blank=True, max_length=13, null=True, verbose_name='phone')),
                ('cell_phone', models.CharField(blank=True, max_length=14, null=True, verbose_name='cell_phone')),
                ('neighborhood', models.CharField(blank=True, max_length=255, null=True, verbose_name='neighborhood')),
                ('street', models.CharField(blank=True, max_length=255, null=True, verbose_name='street')),
                ('number', models.IntegerField(blank=True, null=True, verbose_name='number')),
                ('name', models.CharField(blank=True, max_length=255, verbose_name='institution name')),
                ('cnpj', models.CharField(max_length=18, verbose_name='cnpj')),
            ],
            options={
                'abstract': False,
            },
            bases=('accounts.user', models.Model),
            managers=[
                ('objects', accounts.managers.UserManager()),
            ],
        ),
        migrations.AddField(
            model_name='person',
            name='neighborhood',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='neighborhood'),
        ),
        migrations.AddField(
            model_name='person',
            name='number',
            field=models.IntegerField(blank=True, null=True, verbose_name='number'),
        ),
        migrations.AddField(
            model_name='person',
            name='street',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='street'),
        ),
    ]
