import auth from '../auth';
import api from '../api';

export const ASSESS_CARD = 'ASSESS_CARD';

function shouldFetchCards(state) {
  if (!auth.isAuthenticated()) return false;
  const { data, sync, syncing, } = state.getIn(['db', 'cards']).toJS();
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

function assessCardAction(card, assessment) {
  return {
    type: ASSESS_CARD,
    card,
    assessment,
  };
}

export function assessCard(card, assessment, then) {
  return (dispatch, getState) => {
    dispatch(assessCardAction(card, assessment));
    return dispatch(api.cards.assess(null, {
      body: { id: card, assessment, },
      then,
    }));
  }
}
