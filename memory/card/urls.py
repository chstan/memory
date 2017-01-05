from django.conf.urls import url, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'decks', views.DeckViewSet)
router.register(r'cards', views.CardViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
]
