# Generated by Django 2.2.4 on 2019-08-16 12:33

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('tds', '0004_auto_20190815_2020'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clickstats',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
    ]