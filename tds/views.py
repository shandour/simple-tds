from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_http_methods

from tds.models import Link
from .utils import process_link_request


@require_http_methods(['GET'])
def index_view(request):
    return render(request, 'index.html')


@require_http_methods(['GET'])
def landing_page(request, url):
    url = None
    link = get_object_or_404(Link, url=url)
    redirect_url = process_link_request(link)

    return redirect(redirect_url)
