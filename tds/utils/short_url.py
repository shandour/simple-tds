import string
import random

from django.conf import settings
from tds.models import Link


URL_LENGTH = settings.SHORT_URL_LENGTH
RETRIES = settings.MAX_GENERATION_RETRIES
SYMBOLS_USED = string.ascii_uppercase + string.ascii_lowercase + string.digits


def generate_short_url():
    retries = 0
    while retries < RETRIES:
        generated_url = ''.join(random.SystemRandom().choice(SYMBOLS_USED)
                                for _ in range(URL_LENGTH))
        if not Link.objects.filter(url=generated_url).exists():
            return generated_url

        retries += 1
