# Generated by Django 2.0.1 on 2018-11-19 16:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('donations', '0028_auto_20181109_1424'),
    ]

    operations = [
        migrations.AlterField(
            model_name='donation',
            name='status',
            field=models.CharField(blank=True, choices=[('A', 'Ativa'), ('I', 'Inválida'), ('C', 'Finalizada')], default='A', max_length=1, null=True, verbose_name='status'),
        ),
        migrations.AlterField(
            model_name='solicitation',
            name='status',
            field=models.CharField(blank=True, choices=[('C', 'Criada'), ('A', 'Aceita'), ('R', 'Rejeitada'), ('I', 'Inválida'), ('O', 'Em Espera'), ('F', 'Finalizada - Doada'), ('U', 'Finalizada - Não doada')], default='C', max_length=1, null=True, verbose_name='status'),
        ),
    ]
