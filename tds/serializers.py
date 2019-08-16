import datetime

from django.db import transaction
from django.utils.translation import ugettext_lazy as _

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import (
    Link,
    LinkStatistics,
    LandingPage,
    UniqueUserStatistics,
    UniqueUser,
    ClickStats,
)


class LinkStatisticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LinkStatistics
        exclude = ('link', )


class SimpleLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Link
        fields = ('url',)


class LandingPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LandingPage
        exclude = ('link',)

    def to_representation(self, obj):
        data = super().to_representation(obj)
        # needed to make empty country JSON-serializable
        if data['country'] == '':
            data['country'] = ''
        else:
            data['country'] = {
                'name': obj.country.name,
                'code': obj.country.code,
            }
        return data

    def to_internal_value(self, data):
        instance_id = data.pop('id', None)
        data = super().to_internal_value(data)
        if instance_id:
            data['id'] = instance_id
        return data


class LinkSerializer(serializers.ModelSerializer):
    url = serializers.CharField(allow_blank=False, max_length=100)
    landing_pages = LandingPageSerializer(many=True)

    class Meta:
        model = Link
        fields = (
            'url',
            'landing_pages',
        )

    def to_internal_value(self, data):
        data = super().to_internal_value(data)
        data['manager'] = self.context['request'].user

        return data

    def validate_url(self, value):
        if not self.instance and Link.objects.filter(url=value).exists():
            raise ValidationError([_('Redirect link with short url '
                                     f'path {value} already exists.')])
        return value

    @staticmethod
    def get_landing_pages(validated_data):
        landing_pages = validated_data.pop('landing_pages')
        if not landing_pages:
            raise ValidationError([_('At least 1 landing page is required.')])

        return landing_pages

    @staticmethod
    def split_landing_pages(landing_pages):
        pages_with_ids = []
        new_pages = []
        for lp in landing_pages:
            if lp.get('id'):
                pages_with_ids.append(lp)
            else:
                new_pages.append(lp)

        return pages_with_ids, new_pages

    @staticmethod
    def validate_pages_with_ids(old_page_ids, new_page_ids):
        if len(old_page_ids) < len(new_page_ids):
            raise ValidationError({
                'landing_pages': _(
                    'The number of landing pages with ids sent '
                    'with the request exceeds the number of pages '
                    'associated with the redirect link.')
            })
        if not set(new_page_ids).issubset(old_page_ids):
            raise ValidationError({
                'landing_pages': _(
                    'Invalid landing pages sent with the request.')
            })

    @staticmethod
    def create_landing_pages(link, landing_pages):
        for landing_page in landing_pages:
            landing_page['link'] = link
            LandingPage.objects.create(**landing_page)

    @staticmethod
    def update_landing_pages(landing_pages):
        for landing_page in landing_pages:
            LandingPage.objects.filter(
                pk=landing_page.get('id')).update(**landing_page)

    @classmethod
    def process_landing_pages(cls, link, landing_pages):
        prev_landing_page_ids = link.landing_pages.values_list('pk', flat=True)
        incoming_landing_pages_with_ids,\
            new_landing_pages = cls.split_landing_pages(landing_pages)
        incoming_page_ids = [
            lp.get('id') for lp in incoming_landing_pages_with_ids]
        cls.validate_pages_with_ids(prev_landing_page_ids, incoming_page_ids)

        cls.create_landing_pages(link, new_landing_pages)

        landing_pages_to_delete = set(prev_landing_page_ids)\
                                  .difference(set(incoming_page_ids))
        if landing_pages_to_delete:
            LandingPage.objects.filter(
                pk__in=landing_pages_to_delete).delete()

    @transaction.atomic
    def update(self, link, validated_data):
        landing_pages = self.get_landing_pages(validated_data)
        link = super().update(link, validated_data)

        self.process_landing_pages(link, landing_pages)
        return link

    @transaction.atomic
    def create(self, validated_data):
        landing_pages = self.get_landing_pages(validated_data)

        link = super().create(validated_data)
        self.create_landing_pages(link, landing_pages)

        return link


# not used for creating / updating links
class LinkDetailSerializer(LinkSerializer):
    @staticmethod
    def get_unique_users(link):
        data = {}
        for user in link.unique_users.all():
            data[user.ip] = UniqueUserStatistics.objects.filter(
                user=user, link=link
            ).first().last_request_time
        return data if data else None

    def to_representation(self, obj):
        data = super().to_representation(obj)
        # get statistics info
        stats = {
            'link_stats': LinkStatisticsSerializer(
                instance=obj.link_stats).data
            if getattr(obj, 'link_stats', None) else None,
            'user_stats': self.get_unique_users(obj),
        }
        data.update(stats)

        return data


class UserStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniqueUser
        fields = ('ip',)

    @staticmethod
    def get_url_history(unique_user, request_user):
        if not request_user.is_authenticated:
            return
        qs = unique_user.user_stats
        if not request_user.is_superuser:
            qs = qs.filter(link__manager=request_user)
        else:
            qs = qs.all()

        data = {}
        for stat in qs:
            data[stat.link.url] = {
                'last_request_time': stat.last_request_time,
                'all_times': stat.click_stats
                .order_by('-click_time')
                .values_list('click_time', flat=True)
            }
        return data if data else None

    def to_representation(self, obj):
        data = super().to_representation(obj)
        user = self.context['request'].user

        data['url_info'] = self.get_url_history(obj, user)

        return data


class LinkHourlyStatsSerializer(serializers.ModelSerializer):
    hourly_stats = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Link
        fields = ('hourly_stats',)

    @staticmethod
    def get_stats_for_hour(relevant_time, link):
        return ClickStats.objects.filter(
            user_stats__link=link,
            click_time__date=relevant_time.date(),
            click_time__hour=relevant_time.hour,
        ).distinct().count()

    def get_hourly_stats(self, link):
        data = []
        relevant_time = datetime.datetime.now() - datetime.timedelta(hours=24)
        for _i in range(24):
            relevant_time += datetime.timedelta(hours=1)
            data.append({
                'x': relevant_time,
                'y': self.get_stats_for_hour(relevant_time, link)
            })

        return data
