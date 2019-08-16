from functools import lru_cache

from django_countries import countries


@lru_cache(maxsize=None)
def get_countries_payload():
    countries_lst = []
    for code, name in list(countries):
        countries_lst.append({'code': code, 'name': name})

    return countries_lst
