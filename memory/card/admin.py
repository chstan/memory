from django.contrib import admin

# Register your models here.

from .models import Card, Deck

admin.site.register(Card)
admin.site.register(Deck)
