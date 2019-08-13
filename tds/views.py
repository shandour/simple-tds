from django.shortcuts import redirect, get_object_or_404
from django.views.decorators.http import require_http_methods
from django.utils.translation import ugettext_lazy as _
from rest_framework import generics
# from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from tds.models import Link
from .utils import process_link_request
from .serializers import LinkSerializer


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
    serializer_class = LinkSerializer

    def get_queryset(self):
        return Link.objects.filter(manager=self.request.user)


class ManiupulateLink(generics.RetrieveUpdateDestroyAPIView, LinkAccessMixin):
    serializer_class = LinkSerializer
    queryset = Link.objects.all()

