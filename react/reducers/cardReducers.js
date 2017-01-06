import { combineReducers } from 'redux-immutable';
import Immutable from 'immutable';

function cards(state = Immutable.Map({}), action) {
  switch (action.type) {
  default:
    return state;
  }
}

const rootReducer = combineReducers({
  data: cards,
});

export default rootReducer;
