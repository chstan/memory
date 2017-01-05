import auth from '../auth';
import api from '../api';

export const ASSESS_CARD = 'ASSESS_CARD';

function shouldFetchCards(state) {
  if (!auth.isAuthenticated()) return false;
  const { data, sync, syncing, } = state.db.cards;
  if (syncing) {
    return false;
  } else if (!sync) {
    return true;
  }
  return false
}

export function fetchCardsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchCards(getState())) {
      return dispatch(fetchCards());
    }
  };
}

function assessCardAction(card, value) {
  return {
    type: ASSESS_CARD,
    card,
    value,
  };
}

export function assessCard(card, value) {
  return (dispatch, getState) => {
    dispatch(api.cards.assess({}, { id: card, value, }));
    return dispatch(assessCardAction(card, value));
  }
}
