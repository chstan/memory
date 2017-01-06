import _ from 'lodash';

import auth from '../auth';
import api from '../api';

import { push } from 'react-router-redux';

export const LOGOUT = 'LOGOUT';

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

export function logout() {
  return (dispatch, getState) => {
    sessionStorage.removeItem('token');
    dispatch(push('/app/'));
    return dispatch({
      type: LOGOUT,
    });
  };
}
