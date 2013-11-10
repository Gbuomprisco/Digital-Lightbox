# Template file for local settings.
# Do NOT change settings.py instead copy this to local_settings.py, change it
# to suite the environment, but do NOT commit it to version control.
DEBUG = True

PROJECT_URL = '/'

ADMINS = (
    # ('Your Name', 'your_email@domain.com'),
)

MANAGERS = ADMINS
# Additional locations of static files
STATICFILES_DIRS = (
	"/home/giancarlo/Dropbox/dissertation_django2-development/lightbox/assets/",
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)

TEMPLATE_DIRS = (
	"/home/giancarlo/Dropbox/dissertation_django2-development/lightbox/templates/",
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'Digipal',
        'USER': 'postgres',
        'PASSWORD': 'digipal',
        'HOST': 'localhost',
        'PORT': '',
    },


}


