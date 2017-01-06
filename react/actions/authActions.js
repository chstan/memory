import fetch from 'isomorphic-fetch';
import { push } from 'react-router-redux';
import { SERVER_URL } from '../utils/config';
import { checkHttpStatus, dataToFormData } from '../utils';

import { fetchProfileIfNeeded } from './userActions';
import { fetchDecksIfNeeded } from './deckActions';

import {
  AUTH_LOGIN_USER_REQUEST,
  AUTH_LOGIN_USER_FAILURE,
  AUTH_LOGIN_USER_SUCCESS,
  AUTH_SIGNUP_USER_REQUEST,
  AUTH_SIGNUP_USER_FAILURE,
  AUTH_SIGNUP_USER_SUCCESS,
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
    type: AUTH_LOGIN_USER_REQUEST,
  };
}

export function authSignupUserRequest() {
  return {
    type: AUTH_SIGNUP_USER_REQUEST,
  };
}

export function authSignupUserFailure(error, message) {
  return {
    type: AUTH_SIGNUP_USER_FAILURE,
    payload: {
      status: error,
      statusText: message,
    },
  };
}

export function authSignupUserSuccess(data) {
  return {
    type: AUTH_SIGNUP_USER_SUCCESS,
    payload: data,
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
    return fetch(`${SERVER_URL}/auth/login/`, {
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
      .then(({ auth_token }) => {
        dispatch(authLoginUserSuccess(auth_token));
        dispatch(fetchProfileIfNeeded());
        dispatch(fetchDecksIfNeeded());
        dispatch(push(redirect));
      });
  };
}

export function authSignupUser({ email, password, username }, redirect='/app/') {
  return (dispatch) => {
    dispatch(authSignupUserRequest());
    return fetch(`${SERVER_URL}/auth/register/`, {
      method: 'POST',
      body: dataToFormData({
        email, password, username,
      }),
      headers: {
        'Accept': 'application/json',
      }
    }).then(checkHttpStatus)
      .then(response => response.json())
      .then((response) => {
        dispatch(authLoginUser(username, password, redirect));
      })
  }
}
