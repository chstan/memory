import CLEAR_RESULTS from '../actions/studyActions';

import Immutable from 'immutable';

export default function (state = Immutable.fromJS({
  results: [],
}), action) {
  switch (action.type) {
    case CLEAR_RESULTS:
      return state.set('schedule', Immutable.fromJS([]));
    default:
      return state;
  };
}
