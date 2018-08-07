# Generated by Django 2.0.1 on 2018-07-13 16:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('donations', '0012_auto_20180713_0033'),
    ]

    operations = [
        migrations.AlterField(
            model_name='solicitation',
            name='status',
            field=models.CharField(blank=True, choices=[('S', 'Solicitada'), ('A', 'Aceita'), ('R', 'Rejeitada'), ('NA', 'Não respondida')], default='S', max_length=1, null=True, verbose_name='status'),
        ),
    ]