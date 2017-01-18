from django.shortcuts import render
from django.contrib.auth.models import User, Group
from django.http import HttpResponseBadRequest

from .models import Deck, Card
from .permissions import UserIsOwnerPermission

from rest_framework import permissions, viewsets
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response

from .serializers import (DeckSerializer, CardSerializer,
                          UserSerializer, GroupSerializer)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @list_route(permission_classes=[permissions.IsAuthenticated])
    def me(self, request, *args, **kwargs):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class DeckViewSet(viewsets.ModelViewSet):
    queryset = Deck.objects.all()
    serializer_class = DeckSerializer

    permissions_classes = (permissions.IsAuthenticated, UserIsOwnerPermission,)

    def get_queryset(self):
        return super(DeckViewSet, self).get_queryset().filter(
            owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        serializer.save(owner=self.request.user)


class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer

    permissions_classes = (permissions.IsAuthenticated, UserIsOwnerPermission,)

    def get_queryset(self):
        return super(CardViewSet, self).get_queryset().filter(
            owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        serializer.save(owner=self.request.user)


    @detail_route(methods=['POST'], permission_classes=[permissions.IsAuthenticated])
    def assess(self, request, pk=None, *args, **kwargs):
        card = self.get_object()

        try:
            quality = request.data['assessment']

            # update the card
            card.assess(quality)
            card.save()
            card.refresh_from_db()

            serializer = self.get_serializer(card)
            return Response(serializer.data)
        except KeyError:
            return HttpResponseBadRequest("Expected 'assessment' in body.")
