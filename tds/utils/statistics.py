from typing import Tuple

from django.db import transaction
from django.db.models import F
from django.http import Http404
from ipware import get_client_ip
from geoip2.errors import AddressNotFoundError

from django_tds.country_reader import reader
from ..models import (
    Link, LandingPage, UniqueUser,
    LinkStatistics, LinkCountry, UniqueUserStatistics)


@transaction.atomic
def process_statistics(link: Link, ip: str, country_code: str) -> None:
    user, _ = UniqueUser.objects.get_or_create(ip=ip)

    link_stat_qs = LinkStatistics.objects.filter(link=link)
    if link_stat_qs:
        link_stat = link_stat_qs.first()
    else:
        link_stat = LinkStatistics.objects.create(link=link, last_ip=ip)
    link_stat.last_ip = ip
    link_stat.save()

    link_stat_update_fields = {'clicks': F('clicks') + 1}

    link_country, created = LinkCountry.objects\
                                       .get_or_create(country=country_code)
    country_has_link = link_country.links.filter(url=link.url).exists()
    link_country.links.add(link)
    if created or not country_has_link:
        link_stat_update_fields['num_countries'] = F('num_countries') + 1

    if not link.unique_users.filter(ip=ip).exists():
        link_stat_update_fields['num_unique_users'] = F('num_unique_users') + 1
    user.links.add(link)

    user_stat, _ = UniqueUserStatistics.objects\
                                       .get_or_create(user=user, link=link)
    # update last_request_time
    user_stat.save()

    LinkStatistics.objects.filter(link=link).update(**link_stat_update_fields)


def get_redirect_link(link: Link, country_code: str) -> str:
    qs = LandingPage.objects

    if country_code:
        country_qs = qs.filter(country=country_code)
        page_for_country_exists = country_qs.exists()
        if page_for_country_exists:
            qs = country_qs

    return qs.order_by('-weight').first().url


def check_if_landing_pages_exist(link: Link) -> None:
    if not link.landing_pages.count():
        raise Http404


def get_ip_and_country_code(request) -> Tuple[str, str]:
    ip, _ = get_client_ip(request)
    country_code = None
    try:
        if ip:
            response = reader.country(ip)
            country_code = response.couhtry.iso_code
    except (AddressNotFoundError, AttributeError):
        pass

    return ip, country_code


def process_link_request(link: Link, request) -> str:
    check_if_landing_pages_exist(link)

    ip, country_code = get_ip_and_country_code(request)
    if ip and country_code:
        process_statistics(link, ip, country_code)

    return get_redirect_link(link, country_code)
