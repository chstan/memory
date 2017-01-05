import { combineReducers } from 'redux';

import { REQUEST_PROFILE, RECEIVE_PROFILE } from '../actions/userActions';

function me(state = {}, action) {
  switch (action.type) {
    default:
      return state
  }
}

const rootReducer = combineReducers({
  data: me,
});

export default rootReducer;
