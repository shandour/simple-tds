from rest_framework import serializers

from .models import Link, LinkStatistics


class SimpleLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Link
        fields = ('id', 'url',)




# TODO: proper handling
class LinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Link
        fields = (
            'id',
            'url',
            # 'landing_pages'
        )

# to representation for statistics
# create for creation
# update for updating
