# Generated by Django 2.2.4 on 2019-08-17 20:57

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django_countries.fields
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Link',
            fields=[
                ('url', models.CharField(editable=False, max_length=100, primary_key=True, serialize=False)),
                ('manager', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UniqueUser',
            fields=[
                ('ip', models.GenericIPAddressField(editable=False, primary_key=True, serialize=False)),
                ('links', models.ManyToManyField(related_name='unique_users', to='tds.Link')),
            ],
        ),
        migrations.CreateModel(
            name='UniqueUserStatistics',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_request_time', models.DateTimeField(auto_now=True)),
                ('link', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_stats', to='tds.Link')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_stats', to='tds.UniqueUser')),
            ],
            options={
                'unique_together': {('user', 'link')},
            },
        ),
        migrations.CreateModel(
            name='LinkStatistics',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_ip', models.GenericIPAddressField()),
                ('clicks', models.PositiveIntegerField(default=0)),
                ('num_countries', models.PositiveIntegerField(default=0)),
                ('num_unique_users', models.PositiveIntegerField(default=0)),
                ('link', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='link_stats', to='tds.Link')),
            ],
        ),
        migrations.CreateModel(
            name='LinkCountry',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('country', django_countries.fields.CountryField(max_length=2)),
                ('links', models.ManyToManyField(related_name='link_countries', to='tds.Link')),
            ],
        ),
        migrations.CreateModel(
            name='LandingPage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('weight', models.PositiveIntegerField(blank=True, default=1)),
                ('country', django_countries.fields.CountryField(blank=True, max_length=2, null=True)),
                ('url', models.CharField(max_length=1000, validators=[django.core.validators.URLValidator()])),
                ('link', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='landing_pages', to='tds.Link')),
            ],
        ),
        migrations.CreateModel(
            name='ClickStats',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('click_time', models.DateTimeField(auto_now_add=True)),
                ('user_stats', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='click_stats', to='tds.UniqueUserStatistics')),
            ],
        ),
    ]
