# -*- coding: utf-8 -*-
# Django settings for dissertation_django project.
import os
import sys

DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
     ('Giancarlo Buomprisco', 'giancarlopsk@gmail.com'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': '',                      # Or path to database file if using sqlite3.
        'USER': '',                      # Not used with sqlite3.
        'PASSWORD': '',                  # Not used with sqlite3.
        'HOST': '',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
    }
}

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'America/Chicago'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/media/"
MEDIA_ROOT = '/media/'
# Full filesystem path to the project.
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(PROJECT_ROOT, 'apps'))
PROJECT_DIRNAME = PROJECT_ROOT.split(os.sep)[-1]
DATABASE_ROUTERS = (
        '%s.dbrouter.DigipalDBRouter' % PROJECT_DIRNAME,
        )

# Name of the directory for the project.
PROJECT_DIRNAME = PROJECT_ROOT.split(os.sep)[-1]
# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://media.lawrence.com/media/", "http://example.com/media/"
MEDIA_URL = '/media/'

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: '/home/media/media.lawrence.com/media/'
MEDIA_ROOT = os.path.join(PROJECT_ROOT, MEDIA_URL.strip('/'))

# Annotations
ANNOTATIONS_URL = 'uploads/annotations/'
ANNOTATIONS_ROOT = os.path.join(PROJECT_ROOT, MEDIA_URL.strip('/'),
        ANNOTATIONS_URL.strip('/'))

if not os.path.exists(ANNOTATIONS_ROOT):
    os.makedirs(ANNOTATIONS_ROOT)

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.lawrence.com/static/"
STATIC_ROOT = '/static/'

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
STATIC_URL = '/static/'



# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
    'compressor.finders.CompressorFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = '+b_4*g5_s3o1k2lm2atoe#a1*t7wqoc-vah5(xo19@fr3)qfbk'

INTERNAL_IPS = ('127.0.0.1',)
# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    #'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
     #'debug_toolbar.middleware.DebugToolbarMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
)
INTERNAL_IPS = ('127.0.0.1',)

ROOT_URLCONF = 'dissertation_django.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'dissertation_django.wsgi.application'

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Uncomment the next line to enable the admin:
    'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',
    "compressor",
    "digipal",
    "south",
    'debug_toolbar',
    'django_extensions',
)
DEBUG_TOOLBAR_CONFIG = {'INTERCEPT_REDIRECTS': False}

TEMPLATE_CONTEXT_PROCESSORS = (
        'django.core.context_processors.debug',
        )

PACKAGE_NAME_FILEBROWSER = 'filebrowser_safe'
PACKAGE_NAME_GRAPPELLI = 'grappelli_safe'


COMPRESS_OFFLINE_CONTEXT = {
        'path_to_files': '/home/giancarlo/Documenti/dissertation_django/dissertation_django/assets/static/',
    }

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}

# Hand/Legacy
HISTORICAL_ITEM_TYPES = ['charter', 'manuscript']
INSTITUTION_TYPES = ['medieval institution', 'modern repository']
UNKOWN_PLACE_NAME = '000000'

LEGACY_CATEGORY_REGEX = r'^(\w+).*'
LEGACY_INSTITUTION_DICT = {0: INSTITUTION_TYPES[0], 2: INSTITUTION_TYPES[1]}
LEGACY_LIBRARY_REGEX = r'\[?([^,]*),\s+([^],]*),?\s*([^\]]*)'
LEGACY_MODERN_PERSON = 1
LEGACY_NULL_BOOLEAN_DICT = {-1: True, 0: False, 1: None}
LEGACY_REFERENCE_REGEX = r'[\[\{]([^#]*)#[^#]*[\]\}]?'
LEGACY_REFERENCE_PAGE_REGEX = r'([\[])([^#]*)(#\d*)[^\]]*([\]])'

SOURCE_CLA = 'cla'
SOURCE_GNEUSS = 'gneuss'
SOURCE_KER = 'ker'
SOURCE_SCRAGG = 'scragg'
SOURCE_SAWYER = 'sawyer'
SOURCE_PELTERET = 'pelteret'
SOURCES = [SOURCE_CLA, SOURCE_GNEUSS, SOURCE_KER, SOURCE_SCRAGG, SOURCE_SAWYER,
        SOURCE_PELTERET]

CATALOGUE_NUMBERS = {'cla_number': SOURCE_CLA,
        'index': SOURCE_GNEUSS,
        'ker_index': SOURCE_KER,
        'scragg': SOURCE_SCRAGG,
        'sawyer_number': SOURCE_SAWYER,
        'pelteret_number': SOURCE_PELTERET}

CHARACTER_ABBREV_STROKE = 'abbrev.stroke'

CHOPPER_EXPORTS = os.path.join(MEDIA_ROOT, 'chopper')
CHOPPER_NAMESPACE = {'c': 'http://idp.bl.uk/chopper/standalone'}
CHOPPER_SOURCES = {'G': SOURCE_GNEUSS, 'S': SOURCE_SAWYER}
CHOPPER_CHARACTER_MAPPING = {u'Ã°': 'eth', u'Ã¾': 'thorn', '(punctus)': '.',
        '(punctus elevatus)': './', '(punctus versus)': ';',
        '(punctus uersus)': ';', '(abbrev)': CHARACTER_ABBREV_STROKE,
        '(accent)': 'accent', '(ligature)': 'ligature', '(wynn)': 'wynn',
        'w': 'wynn', 'asc': u'Ã¦', 'll': 'l', 'rr': 'r', 'v': 'u',
        'nasal': CHARACTER_ABBREV_STROKE, ':-': ';'}
CHOPPER_ABBREV_STROKE_MARKER = '['

ITEM_PART_DEFAULT_LOCUS = 'face'

SCRIBE_NAME_PREFIX = 'DigiPal Scribe '

STATUS_CHOPPER = 'chopper'
STATUS_DEFAULT = 'draft'
STATUS = [STATUS_DEFAULT, STATUS_CHOPPER]

MAX_THUMB_LENGTH = 50

# Image Server

# IMAGE_SERVER_WEB_ROOT is now only used for the migration script
IMAGE_SERVER_WEB_ROOT = 'jp2'
IMAGE_SERVER_HOST = 'digipal.cch.kcl.ac.uk'
IMAGE_SERVER_PATH = '/iip/iipsrv.fcgi'
IMAGE_SERVER_METADATA = '%s?FIF=%s&OBJ=Max-size'
IMAGE_SERVER_METADATA_REGEX = r'^.*?Max-size:(\d+)\s+(\d+).*?$'
IMAGE_SERVER_ZOOMIFY = 'http://%s%s?zoomify=%s/'
IMAGE_SERVER_FULL = 'http://%s%s?FIF=%s&RST=*&QLT=100&CVT=JPG'
IMAGE_SERVER_THUMBNAIL = 'http://%s%s?FIF=%s&RST=*&HEI=35&CVT=JPG'
# TODO: move that to the view!
IMAGE_SERVER_THUMBNAIL_HEIGHT = 35
IMAGE_SERVER_RGN = 'http://%s%s?FIF=%s&RST=*&%s&RGN=%f,%f,%f,%f&CVT=JPG'
IMAGE_SERVER_EXT = 'jp2'

# DJANGO-IIPIMAGE

# the URL of the IIP image server (e.g. http://www.mydomain.com/iip/iipsrv.fcgi)
IMAGE_SERVER_URL  = 'http://%s%s' % (IMAGE_SERVER_HOST, IMAGE_SERVER_PATH)
# the absolute filesystem path of the images served by the image server (e.g. /home/myimages)
# this sould correspond to iipserver FILESYSTEM_PREFIX parameter
IMAGE_SERVER_ROOT = '/vol/digipal2/images'
# python manage.py dpim will look under IMAGE_SERVER_ROOT + IMAGE_SERVER_UPLOAD_ROOT for new images to upload 
IMAGE_SERVER_UPLOAD_ROOT = 'jp2'
# file extensions eligible for upload
IMAGE_SERVER_UPLOAD_EXTENSIONS = ('.jp2', '.jpg', 'tif', 'bmp', 'jpeg')


# Images uploads
UPLOAD_IMAGES_URL = 'uploads/images/'
UPLOAD_IMAGES_ROOT = os.path.join(PROJECT_ROOT, MEDIA_URL.strip('/'),
        UPLOAD_IMAGES_URL.strip('/'))

if not os.path.exists(UPLOAD_IMAGES_ROOT):
    os.makedirs(UPLOAD_IMAGES_ROOT)

try:
    from local_settings import *
except ImportError:
    pass
    
