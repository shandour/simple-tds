from django.conf import settings
import geoip2.database

READER_PATH = settings.GEO_IP2_DB_PATH

reader = geoip2.database.Reader(READER_PATH)

