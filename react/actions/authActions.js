import fetch from 'isomorphic-fetch';
import { push } from 'react-router-redux';
import { SERVER_URL } from '../utils/config';
import { checkHttpStatus, dataToFormData } from '../utils';

import { fetchProfileIfNeeded } from './userActions';

import {
  AUTH_LOGIN_USER_REQUEST,
  AUTH_LOGIN_USER_FAILURE,
  AUTH_LOGIN_USER_SUCCESS,
  AUTH_LOGOUT_USER
} from '../constants';

export function authLoginUserSuccess(token) {
  sessionStorage.setItem('token', token);
  return {
    type: AUTH_LOGIN_USER_SUCCESS,
    payload: {
      token
    }
  };
}

export function authLoginUserFailure(error, message) {
  sessionStorage.removeItem('token');
  return {
    type: AUTH_LOGIN_USER_FAILURE,
    payload: {
      status: error,
      statusText: message
    }
  };
}

export function authLoginUserRequest() {
  return {
    type: AUTH_LOGIN_USER_REQUEST
  };
}

export function authLogout() {
  sessionStorage.removeItem('token');

  return {
    type: AUTH_LOGOUT_USER
  };
}

export function authLogoutAndRedirect() {
  return (dispatch, state) => {
    dispatch(authLogout());
    dispatch(push('/app/welcome'));
    return Promise.resolve();
  };
}

export function authLoginUser(username, password, redirect='/app/') {
  return (dispatch) => {
    dispatch(authLoginUserRequest());
    return fetch(`${SERVER_URL}/api-token-auth/`, {
      method: 'POST',
      body: dataToFormData({
        username,
        password,
      }),
      headers: {
        'Accept': 'application/json',
      }
    }).then(checkHttpStatus)
      .then(response => response.json())
      .then(({ token }) => {
        dispatch(authLoginUserSuccess(token));
        dispatch(fetchProfileIfNeeded);
        dispatch(push(redirect));
      });
  };
}
