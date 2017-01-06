import { fetchCards } from './cardActions';

import auth from '../auth';
import api from '../api';

export const SCHEDULE_DECKS = 'SCHEDULE_DECKS';

export function scheduleDecks(deckIds) {
  return {
    type: SCHEDULE_DECKS,
    deckIds,
  };
}

function shouldFetchDecks(state) {
  if (!auth.isAuthenticated()) return false;
  const { data, sync, syncing, } = state.getIn(['db', 'decks']).toJS();
  if (syncing) {
    return false;
  } else if (!sync) {
    return true;
  }
  return false;
}

export function fetchDecksIfNeeded() {
  return (dispatch, getState, { api }) => {
    if (shouldFetchDecks(getState())) {
      return dispatch(api.decks.get());
    }
  };
}

export function fetchCardsForDeckIfNeeded(deck) {
  return (dispatch, getState) => {
    const state = getState();
    const cards = state.getIn(['db', 'cards', 'data']);

    const requiredCards = new Set(deck.toJS().cards);
    const availableCards = new Set(_.map(cards.toJS(), 'id'));

    if (!availableCards.isSuperset(requiredCards)) {
      return dispatch(api.cards.get({ deck: deck.id }, {
        then: () => dispatch(scheduleDecks(new Set([deck.get('id')]))),
      }));
    }
  }
}
