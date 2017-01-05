from datetime import timedelta
from django.utils import timezone

from .constants import (
    MAX_QUALITY, MIN_QUALITY,
    MAX_EASINESS, MIN_EASINESS,
    SRS_EPSILON
)

def new_easiness(old_easiness, quality_of_response):
    inv_quality = MAX_QUALITY - quality_of_response

    if quality_of_response < 3:
        # don't modify the easiness if the question was failed, just
        # push the question immediately back onto the queue
        return old_easiness

    # whole bunch of magic numbers come from the supermemo description
    new_easiness = old_easiness + (0.1 - inv_quality * (0.08 + inv_quality * 0.02))
    return MIN_EASINESS if new_easiness < MIN_EASINESS else new_easiness

def new_interval(repetition_count, old_interval, easiness, quality):
    if repetition_count == 0:
        return SRS_EPSILON

    if repetition_count == 1:
        return timedelta(days=1)

    # slight modification on SuperMemo here, we aren't using six days
    # for the second showing, but we can reassess later

    return old_interval * easiness
