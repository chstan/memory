import fetch from 'isomorphic-fetch';
import adapterFetch from 'redux-api/lib/adapters/fetch';
import ReduxApi, { transformers } from 'redux-api';
import auth from './auth';

import { checkHttpStatus } from './utils';

import Immutable from 'immutable';
import qs from 'qs';
import UrlPattern from 'url-pattern';
import _ from 'lodash';

class ApiEndpoint {
  constructor({ url, ...config }) {
    this._inited = false;
    this._path = null;
    this._urlPattern = new UrlPattern(url);
    this._customActions = _.get(config, 'actions', {});
    this.initialState = Immutable.fromJS({
      loading: false,
      syncing: false,
      error: null,
      data: {},
    });
  }

  registerAction(name, method) {
    const namespacedName = `api@${this._path}@${name}`;
    this.events[name] = namespacedName;
    this.eventsToReducers[namespacedName] = method.bind(this);
  }

  init(path = '') {
    this._inited = true;
    this._path = path;

    this.events = {
      actionFetch: `api@${path}@fetch`,
      actionSuccess: `api@${path}@success`,
      actionFail: `api@${path}@fail`,
      actionReset: `api@${path}@reset`,
    };

    // need to use _.fromPairs to avoid using template literals in an
    // object literal key
    this.eventsToReducers = _.fromPairs([
      [`api@${path}@fetch`, this.actionFetch.bind(this)],
      [`api@${path}@success`, this.actionSuccess.bind(this)],
      [`api@${path}@fail`, this.actionFail.bind(this)],
      [`api@${path}@reset`, this.actionReset.bind(this)],
    ]);
  }

  normalize(data) {
    return Immutable.fromJS(data);
  }

  mergeData(oldData, newData) {
    return oldData.merge(newData);
  }

  actionFetch(state, action) {
    return state.merge({
      loading: true,
      error: null,
      syncing: !!action.syncing,
    });
  }

  actionSuccess(state, action) {
    return state.merge({
      loading: false,
      sync: true,
      syncing: false,
      error: null,
    }).updateIn(['data'], data => this.mergeData(data, this.normalize(action.data)));
  }

  actionFail(state, action) {
    return state.merge({
      loading: false,
      error: action.error,
      syncing: false,
    });
  }

  actionReset(state, action) {
    return this.initialState;
  }

  findReducer({ type }) {
    return this.eventsToReducers[type];
  }

  reducer(state = null, action) {
    try {
      const appropriateReducer = this.findReducer(action);
      return appropriateReducer(state, action);
    } catch (e) {
      return state || this.initialState;
    }
  }

  // related to the business of making requests
  headers() {
    let authHeaders = {};
    if (auth.isAuthenticated()) {
      authHeaders = auth.headers;
    }

    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...authHeaders,
    }
  }

  prepQueryParams(params) {
    return _.omit(params, 'detail')
  }

  getUrlPattern(detailName) {
    if (detailName === null) {
      return this._urlPattern;
    }

    return this._detailRoutes[detailName].url;
  }

  runFetch(dispatch, getState, queryParams, { method, ...rest }, onSuccess = null,
           detailName = null) {
    const clientOnSuccess = _.get(rest, 'then', x => x);
    if (onSuccess === null) {
      onSuccess = (response) => {
        dispatch({
          type: this.events.actionSuccess,
          data: response,
        });
      };
    }
    let url = this.getUrlPattern(detailName).stringify(rest.body || queryParams);
    queryParams = this.prepQueryParams(queryParams);
    let queryString = qs.stringify(queryParams);
    if (queryString.length) {
      url = url + '?' + queryString;
    }

    dispatch({
      type: this.events.actionFetch,
    });

    let body = rest.body;
    if (_.isObject(body)) {
      body = JSON.stringify(body);
    }
    return fetch(url, {
      method,
      headers: this.headers(),
      body,
    }).then(checkHttpStatus)
      .then(response => {
        if ([204].includes(response.status)) {
          return response;
        }
        return response.json();
      })
      .then(onSuccess)
      .then(clientOnSuccess)
      .catch((error) => {
        dispatch({
          type: this.events.actionFail,
          error,
        });
      });
  }

  get(queryParams, rest = {}) {
    return (dispatch, getState) => {
      this.runFetch(dispatch, getState, queryParams, {
        method: 'GET',
        ...rest,
      });
    }
  }
}

class CrudEndpoint extends ApiEndpoint {
  constructor(config) {
    super(config);

    this._idKeys = config.idKeys || [];
    this._detailRoutes = config.detailRoutes;
    if (this._detailRoutes) {
      _.map(this._detailRoutes, (spec, name) => {
        spec.url = new UrlPattern(spec.url);
        this[name] = this._createDetailRoute(name, spec);
      });
    }
  }

  _createDetailRoute(name, { urlPattern, ...spec }) {
    const method = _.get(spec, 'method', 'POST');

    let onSuccess = _.get(spec, 'onSuccess', null);
    if (onSuccess) {
      onSuccess = onSuccess.bind(this);
    }
    return function (queryParams, rest = {}) {
      return (dispatch, getState) => {
        this.runFetch(dispatch, getState, queryParams, {
          method,
          ...rest,
        }, onSuccess, name);
      }
    }.bind(this);
  }

  normalize(data) {
    if (_.isUndefined(data)) {
      return Immutable.Map({});
    }

    const idKeysToSets = (item) => {
      let newItem = item;
      this._idKeys.forEach(idKey => {
        newItem = newItem.set(idKey, Immutable.Set(newItem.get(idKey)));
      });
      return newItem;
    };

    if (_.isArray(data)) {
      return Immutable.fromJS(_.zipObject(_.map(data, 'id'), data)).map(
        idKeysToSets);
    }

    return idKeysToSets(Immutable.fromJS({
      [data.id]: data,
    }));
  }

  actionDelete(state, action) {
    return state.merge({
      loading: false,
      sync: true,
      syncing: false,
      error: null,
    }).updateIn(['data'], d => d.filter(o => o.id !== action.data.id));
  }

  init(path = '') {
    super.init(path);

    // registering additional actions has to be done super's init, because it
    // depends on the path being set to generate a namespaced name. If there is
    // no namespaced name, we could generate a random one, but having the
    // namespaces are useful from an organizational perspective as well
    this.registerAction('delete', this.actionDelete);
  }

  post(queryParams, rest = {}) {
    return (dispatch, getState) => {
      this.runFetch(dispatch, getState, queryParams, {
        method: 'POST',
        ...rest,
      });
    };
  }

  patch(queryParams, rest = {}) {
    return (dispatch, getState) => {
      this.runFetch(dispatch, getState, queryParams, {
        method: 'PATCH',
        ...rest,
      });
    };
  }

  delete(queryParams, rest = {}) {
    return (dispatch, getState) => {
      this.runFetch(dispatch, getState, queryParams, {
        method: 'DELETE',
        ...rest,
      }, (response) => {
        dispatch({
          type: this.events.delete,
          data: {
            id: _.get(queryParams, 'id', _.get(rest, 'id')),
          },
        })
      });
    };
  }
}

// written for more or less drop in compatibility with 'redux-api'
class ApiRoot {
  constructor(children) {
    const paths = _.keys(children);

    this._children = children;
    this.actions = {};
    this.events = {};

    const uninitializedReducer = () => { throw new Error(
      'Are you sure you inited the API before constructing your store?') };
    this.reducers = _.zipObject(paths, _.times(
      paths.length, _.constant(uninitializedReducer)));
  }

  init() {
    _.map(this._children, (child, path) => {
      child.init(path);
      this.events[path] = child.events;
      this[path] = child;
      this.reducers[path] = child.reducer.bind(child);
    });
  }
}

const deckEndpoint = new CrudEndpoint({
  url: '/decks/(:id/)',
  idKeys: ['cards'],
});
const cardEndpoint = new CrudEndpoint({
  url: '/cards/(:id/)',
  detailRoutes: {
    assess: {
      url: '/cards/(:id)/assess/',
      method: 'POST',
    },
  },
});
const userEndpoint = new CrudEndpoint({
  url: '/users/(:id/)',
});

const api = new ApiRoot({
  decks: deckEndpoint,
  cards: cardEndpoint,
  users: userEndpoint,
  me: new ApiEndpoint({
    url: '/users/me/',
  }),
});

api.init();

export default api;
