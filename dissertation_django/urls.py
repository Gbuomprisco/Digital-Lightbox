from django.conf.urls import patterns, include, url
from view import search, read_image, get_image_manuscript
# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('django.views.generic.simple',
    # Examples:
    url(r'^$', 'direct_to_template', {'template': 'index.html'}, name='home'),
    (r'^digipal/', include('digipal.urls')),
    (r'^search/$', search),
    (r'^read-image/$', read_image),
    (r'^get-image-manuscript/$', get_image_manuscript),

    # url(r'^dissertation_django/', include('dissertation_django.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
