import React from 'react';
import ReactDOM from 'react-dom';

// get markdown configured before any imports that need it
import md from 'markdown-it';
import mk from 'markdown-it-katex';

window.markdownRenderer = new md();
window.markdownRenderer.use(mk);

import {
  createStore,
  compose,
  applyMiddleware,
  combineReducers,
} from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { Router, IndexRoute, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer,
         routerMiddleware } from 'react-router-redux';

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

// set up stores and reducers
let finalCreateStore;
let reducer = combineReducers({
  db: appReducer,
  routing: routerReducer,
  form: reduxFormReducer,
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

let store = finalCreateStore(reducer);

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
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
  </Provider>,
  document.getElementById('app')
);
