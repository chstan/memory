from django.contrib.auth.models import User, Group

from .models import Deck, Card

from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups', 'id',)

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name', 'id',)

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ('id', 'deck', 'front', 'back',
                  'easiness', 'scheduled_for',)
        read_only_fields = ('scheduled_for', 'easiness',)

class DeckSerializer(serializers.HyperlinkedModelSerializer):
    cards = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Deck
        fields = ('cards', 'title', 'id', 'due_today_count')
