from django.shortcuts import redirect, get_object_or_404
from django.views.decorators.http import require_http_methods
from django.utils.translation import ugettext_lazy as _
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import api_view

from tds.models import Link, UniqueUser
from .utils import (
    process_link_request,
    generate_short_url,
    get_countries_payload,
)
from .serializers import (
    LinkSerializer,
    SimpleLinkSerializer,
    LinkDetailSerializer,
    UserStatsSerializer,
    LinkHourlyStatsSerializer)


@require_http_methods(['GET'])
def landing_page(request, url):
    link = get_object_or_404(Link, url=url)
    redirect_url = process_link_request(link, request)

    return redirect(redirect_url)


# api views =================================================

class LinkAccessMixin:
    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)

        user = request.user
        if not user.is_superuser or obj.manager != user:
            raise PermissionDenied(
                _('You\'re neither a superuser nor a manager for this link.')
            )


class DisplayLinks(generics.ListCreateAPIView):
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return SimpleLinkSerializer
        elif self.request.method == 'POST':
            return LinkSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Link.objects.all()
        return Link.objects.filter(manager=user)


class ManiupulateLink(generics.RetrieveUpdateDestroyAPIView, LinkAccessMixin):
    queryset = Link.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return LinkDetailSerializer
        elif self.request.method == 'PUT':
            return LinkSerializer


@api_view(['GET'])
def get_short_url(request):
    url = generate_short_url()
    if url:
        return Response({'url': url}, status=200)
    else:
        return Response({'error': _('Generation timed out. Please try again')},
                        status=500)


class UserStatsAccessMixin:
    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)

        user = request.user
        if (not user.is_superuser
            or not obj.links.filter(manager=user).exists()):
            raise PermissionDenied(
                _('None of your links have been accessed by this IP.')
            )


class GetUserStats(generics.RetrieveAPIView, UserStatsAccessMixin):
    serializer_class = UserStatsSerializer
    queryset = UniqueUser.objects.all()
    lookup_field = 'ip'


@api_view(['GET'])
def get_countries(request):
    return Response(
        get_countries_payload(),
        status=200,
    )


class LinkStatsView(generics.RetrieveAPIView, LinkAccessMixin):
    serializer_class = LinkHourlyStatsSerializer
    queryset = Link.objects.all()
