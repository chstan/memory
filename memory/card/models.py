from django.db import models
from django.utils import timezone
from datetime import timedelta

from card.spaced_repetition import new_easiness, new_interval

import card.constants as consts

class Deck(models.Model):
    """
    Represents a collection of cards
    """

    title = models.CharField(
        max_length=50, blank=False,
        help_text="Label for the deck indicating the type of content contained inside")

    @property
    def due_today_count(self):
        soon_enough = timezone.now() + timedelta(hours=1)
        return self.cards.filter(scheduled_for__lte=soon_enough).count()


class Card(models.Model):
    """
    Currently we don't record the previous attempts, which is something it might
    useful or at least cute to do.
    """

    ONE_SIDED_TYPE = 'o'
    TYPE_CHOICES = (
        (ONE_SIDED_TYPE, 'One sided'),
        ('t', 'Two sided (learn front to back and back to front)'),
        ('d', 'Derivation'),
    )

    card_type = models.CharField(
        choices=TYPE_CHOICES, max_length=2, default=ONE_SIDED_TYPE,
        help_text='Type of card')

    front = models.TextField(blank=False)
    back = models.TextField(blank=True)

    deck = models.ForeignKey(Deck, blank=False, related_name='cards')

    # Fields related to the spaced repetition algorithm
    easiness = models.FloatField(default=consts.MAX_EASINESS)
    repetition_count = models.IntegerField(default=0)
    interval = models.DurationField(default=consts.SRS_EPSILON)
    scheduled_for = models.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.id:
            # go ahead and set a scheduled date
            self.scheduled_for = timezone.now()

        return super(Card, self).save(*args, **kwargs)

    def assess(self, quality):
        self.easiness = new_easiness(self.easiness, quality)

        if quality < 3:
            self.repetition_count = 0
        else:
            self.repetition_count += 1

        # finally do scheduling
        self.interval = new_interval(
            self.repetition_count, self.interval, self.easiness, quality)

        self.scheduled_for = timezone.now() + self.interval


class DerivationStep(models.Model):
    content = models.TextField(blank=True)

    card = models.ForeignKey(Card, blank=False, related_name='derivation_steps')
