# Generated by Django 2.0.1 on 2019-09-10 14:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('demands', '0006_auto_20190711_1635'),
    ]

    operations = [
        migrations.AlterField(
            model_name='demand',
            name='cep',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='CEP'),
        ),
    ]