import _ from 'lodash';

import auth from '../auth';
import api from '../api';

function shouldFetchProfile(state) {
  const profile = state.getIn(['db', 'me']).toJS().data;
  if (_.isObject(profile) && _.isEmpty(profile) && auth.isAuthenticated()) {
    return true;
  }
  return false;
}

export function fetchProfileIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchProfile(getState())) {
      return dispatch(api.me.get());
    }
  };
}
