import { combineReducers } from 'redux';

function cards(state = {}, action) {
  switch (action.type) {
  default:
    return state;
  }
}

const rootReducer = combineReducers({
  data: cards,
});

export default rootReducer;
