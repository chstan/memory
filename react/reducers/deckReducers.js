import { combineReducers } from 'redux-immutable';

import { SCHEDULE_DECKS } from '../actions/deckActions';

import Immutable from 'immutable';

function decks(state = Immutable.Map({}), action) {
  switch (action.type) {
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  data: decks,
});

export default rootReducer;
