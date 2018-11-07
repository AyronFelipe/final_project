# Generated by Django 2.0.1 on 2018-11-07 12:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('donations', '0024_solicitation_comment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='solicitation',
            name='status',
            field=models.CharField(blank=True, choices=[('S', 'Solicitada'), ('A', 'Aceita'), ('R', 'Rejeitada'), ('I', 'Inválida'), ('O', 'Em Espera')], default='S', max_length=1, null=True, verbose_name='status'),
        ),
    ]
