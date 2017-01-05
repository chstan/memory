import CLEAR_RESULTS from '../actions/studyActions';

export default function (state = {
  results: [],
}, action) {
  switch (action.type) {
    case CLEAR_RESULTS:
      return {
        ...state,
        results: [],
      };
    default:
      return state;
  };
}
