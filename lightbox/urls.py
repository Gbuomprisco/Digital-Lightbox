from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView
from view import search, read_image, get_image_manuscript, external_image_request, transform_xml, return_base64
# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('lightbox.view',
    # Examples:
    url(r'^$', TemplateView.as_view(template_name='lightbox.html')),
    (r'^search/$', search),
    (r'^read-image/$', read_image),
    (r'^get-image-manuscript/$', get_image_manuscript),
    (r'^images/$', external_image_request),
    (r'^transform_xml/$', transform_xml),
    (r'^return_base64/$', return_base64)

    # url(r'^dissertation_django/', include('dissertation_django.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
