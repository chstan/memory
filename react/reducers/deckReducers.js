import { combineReducers } from 'redux';

import { SCHEDULE_DECKS } from '../actions/deckActions';

function decks(state = {}, action) {
  switch (action.type) {
    case SCHEDULE_DECKS:
      return state;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  data: decks,
});

export default rootReducer;
