import uuid

from django.contrib.auth import get_user_model
from django.db import models
from django_countries.fields import CountryField
from django.core.validators import URLValidator


User = get_user_model()


class Link(models.Model):
    # the part after the domain name and slash
    url = models.CharField(primary_key=True, max_length=100, editable=False)
    manager = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)


class LandingPage(models.Model):
    link = models.ForeignKey(
        Link, on_delete=models.CASCADE, related_name="landing_pages")
    weight = models.PositiveIntegerField(default=1, blank=True)
    country = CountryField(null=True, blank=True)
    # full url
    url = models.CharField(max_length=1000, validators=[URLValidator()])


class UniqueUser(models.Model):
    ip = models.GenericIPAddressField(primary_key=True, editable=False)
    links = models.ManyToManyField(Link, related_name="unique_users")


class LinkStatistics(models.Model):
    link = models.OneToOneField(
        Link, on_delete=models.CASCADE, related_name='link_stats')

    last_ip = models.GenericIPAddressField()
    clicks = models.PositiveIntegerField(default=0)
    # counters to not call count over and over again
    num_countries = models.PositiveIntegerField(default=0)
    num_unique_users = models.PositiveIntegerField(default=0)


class LinkCountry(models.Model):
    country = CountryField()
    links = models.ManyToManyField(Link, related_name="link_countries")


class UniqueUserStatistics(models.Model):
    user = models.ForeignKey(
        UniqueUser,
        on_delete=models.CASCADE,
        related_name='user_stats')
    link = models.ForeignKey(
        Link,
        on_delete=models.CASCADE,
        related_name='user_stats'
    )
    last_request_time = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'link')


class ClickStats(models.Model):
    # id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_stats = models.ForeignKey(
        UniqueUserStatistics, related_name='click_stats',
        on_delete=models.CASCADE)
    click_time = models.DateTimeField(auto_now_add=True)

