import React from 'react';
import ReactDOM from 'react-dom';

// get markdown configured before any imports that need it
import md from 'markdown-it';
import mk from 'markdown-it-katex';

window.listener = new window.keypress.Listener();

window.markdownRenderer = new md();
window.markdownRenderer.use(mk);

import {
  createStore,
  compose,
  applyMiddleware,
} from 'redux';

import { combineReducers } from 'redux-immutable';
import Immutable from 'immutable';

import { reducer as reduxFormReducer } from 'redux-form';
import ReduxToastr, { reducer as toastrReducer } from 'react-redux-toastr';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { Router, IndexRoute, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore,
         routerMiddleware,
         LOCATION_CHANGE } from 'react-router-redux';

import appReducer from './reducers';
import deckReducers from './reducers/deckReducers';
import cardReducers from './reducers/cardReducers';
import userReducers from './reducers/userReducers';
import AppContainer from './containers/AppContainer';
import DeckListContainer from './containers/DeckListContainer';
import StudyPageContainer from './containers/StudyPageContainer';
import StatisticsPage from './containers/StatisticsPage';
import WelcomePage from './containers/WelcomePage';
import CardDetailPage from './containers/CardDetailPage';
import AddCardPage from './containers/AddCardPage';
import DeckDetailPage from './components/DeckDetailPage';
import AddDeckPage from './components/AddDeckPage';

import DevTools from './containers/DevTools';

import api from './api';
window.api = api;

// have to do a bit of extra work in order to make Immutable work with
// react-router-redux and redux-form
const threadImmutable = reducer => (imm, ...args) =>
  Immutable.fromJS(reducer(imm ? imm.toJS() : {}, ...args));

const initialRouterState = Immutable.fromJS({
  locationBeforeTransitions: null
});

const routerReducer = (state = initialRouterState, action) => {
  if (action.type === LOCATION_CHANGE) {
    return state.set('locationBeforeTransitions', action.payload);
  }

  return state;
};

// set up stores and reducers
let finalCreateStore;
let reducer = combineReducers({
  db: appReducer,
  routing: routerReducer,
  form: threadImmutable(reduxFormReducer),
  toastr: toastrReducer,
});

if (process.env.NODE_ENV === 'production') {
  // prod
  finalCreateStore = compose(
    applyMiddleware(thunk.withExtraArgument({ api })),
    applyMiddleware(routerMiddleware(browserHistory)),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore);
} else {
  // dev
  finalCreateStore = compose(
    applyMiddleware(thunk.withExtraArgument({ api })),
    applyMiddleware(routerMiddleware(browserHistory)),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore);
}

const initialRootState = Immutable.Map();
let store = finalCreateStore(reducer, initialRootState);

const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState (state) {
    return state.get('routing').toObject();
  },
});

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Router history={history}>
        <Route path="/app/" component={AppContainer}>
          <IndexRoute component={WelcomePage} />

          <Route path="decks/add" component={AddDeckPage} />
          <Route path="decks/deck/:deckId" component={DeckDetailPage} />
          <Route path="decks/deck/:deckId/add" component={AddCardPage} />
          <Route path="decks/deck/:deckId/card/:cardId" component={CardDetailPage} />

          <Route path="decks" component={DeckListContainer} />
          <Route path="decks/deck/:deckId/study" component={StudyPageContainer} />
          <Route path="statistics" component={StatisticsPage} />
        </Route>
      </Router>
      <ReduxToastr position="bottom-right" transitionIn="fadeIn" transitionOut="fadeOut"/>
    </div>
  </Provider>,
  document.getElementById('app')
);
