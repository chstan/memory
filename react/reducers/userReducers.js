import { combineReducers } from 'redux-immutable';

import { REQUEST_PROFILE, RECEIVE_PROFILE } from '../actions/userActions';

import Immutable from 'immutable';

function me(state = Immutable.Map({}), action) {
  switch (action.type) {
    default:
      return state
  }
}

const rootReducer = combineReducers({
  data: me,
});

export default rootReducer;
