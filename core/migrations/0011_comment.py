# Generated by Django 2.0.1 on 2018-11-07 03:15

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0010_auto_20181011_1042'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='updated at')),
                ('content', models.TextField(verbose_name='content')),
                ('commented', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='comments_received', to=settings.AUTH_USER_MODEL)),
                ('commenter', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='comments_made', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'comments',
                'verbose_name': 'comment',
            },
        ),
    ]
