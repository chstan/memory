"""
Manages production settings options. Should be run by setting DJANGO_SETTINGS_MODULE
to 'memory.production_settings' in wsgi.py
"""

from .settings import *

SECURE_HSTS_SECONDS = 1
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True

DEBUG = False
X_FRAME_OPTIONS = 'DENY'

# this is not for production, we use a jinja template for that
# file for that
ALLOWED_HOSTS = ['localhost']

# Set secret key
