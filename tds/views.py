from django.shortcuts import redirect, get_object_or_404
from django.views.decorators.http import require_http_methods
from django.utils.translation import ugettext_lazy as _
from rest_framework import generics
# from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from tds.models import Link
from .utils import process_link_request
from .serializers import (
    LinkSerializer,
    SimpleLinkSerializer,
    LinkDetailSerializer)


@require_http_methods(['GET'])
def landing_page(request, url):
    url = None
    link = get_object_or_404(Link, url=url)
    redirect_url = process_link_request(link)

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
    serializer_class = LinkSerializer
    queryset = Link.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return LinkDetailSerializer
        elif self.request.method == 'POST':
            return LinkSerializer
