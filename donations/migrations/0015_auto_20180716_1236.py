# Generated by Django 2.0.1 on 2018-07-16 15:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('donations', '0014_solicitation_is_evaluated'),
    ]

    operations = [
        migrations.AlterField(
            model_name='solicitation',
            name='status',
            field=models.CharField(blank=True, choices=[('S', 'Solicitada'), ('A', 'Aceita'), ('R', 'Rejeitada'), ('NA', 'Não respondida'), ('I', 'Inválida')], default='S', max_length=1, null=True, verbose_name='status'),
        ),
    ]