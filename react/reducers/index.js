import api from '../api';
import { combineReducers } from 'redux-immutable';

import Immutable from 'immutable';

import { SCHEDULE_DECKS } from '../actions/deckActions';
import { ASSESS_CARD } from '../actions/cardActions';

import deckReducers from './deckReducers';
import cardReducers from './cardReducers';
import userReducers from './userReducers';
import studyReducers from './studyReducers';

import moment from 'moment';
import _ from 'lodash';

const spliceBusinessLogic = combineReducers({
  decks: (state, action, ...args) => deckReducers(
    api.reducers.decks(state, action), action, ...args),
  cards: (state, action, ...args) => cardReducers(
    api.reducers.cards(state, action), action, ...args),
  users: (state, action, ...args) => userReducers(
    api.reducers.users(state, action), action, ...args),
  me: api.reducers.me,
  study: studyReducers,
});

function assessCardReducer(state, { card, assessment }) {
  // the big thing that needs to happen is that we need to update the schedule
  // for the card
  let newState = state;
  const deckId = state.getIn(['cards', 'data', String(card), 'deck']);
  newState = newState.updateIn(['decks', 'data', String(deckId), 'schedule'], s => {
    const t = s.filter(cid => cid !== card);
    if (assessment < 3) {
      return t.push(card);
    }

    return t;
  });

  const newSchedule = newState.getIn(['decks', 'data', String(deckId), 'schedule']);
  newState = newState.setIn(['decks', 'data', String(deckId), 'due_today_count'],
                            newSchedule.count());

  // finally we need to push the assessment onto the recent results for
  // the session
  newState = newState.updateIn(['study', 'results'], results => results.push(Immutable.Map({
    card,
    assessment,
  })));

  return newState;
}

function scheduleDecksReducer(state, { deckIds }) {
  let newState = state;
  const decks = state.getIn(['decks', 'data']).toJS();
  const cards = state.getIn(['cards', 'data']).toJS();

  const updatedDecks = {};
  const midnight = moment().add(1, 'days').startOf('day');

  // this method isn't too bad if there aren't too many decks to update
  // would be slow otherwise but we can assess later
  deckIds.forEach(id => {
    const schedule = _.chain(decks[id].cards)
                      .map(cid => cards[cid])
                      .filter(card => moment(
                        card.scheduled_for).diff(midnight) < 0)
                      .sortBy(card => moment(card.scheduled_for))
                      .map(card => card.id)
                      .value();
    newState = newState.setIn(['decks', 'data', String(id), 'schedule'], Immutable.List(schedule));
    newState = newState.setIn(['decks', 'data', String(id), 'due_today_count'], schedule.length);
  });

  return newState;
}

const dbLevelBusinessLogicReducers = _.fromPairs([
  [SCHEDULE_DECKS, scheduleDecksReducer],
  [ASSESS_CARD, assessCardReducer],
]);

export default function appReducer(state, action, ...args) {
  // we do any additional business logic here that requires access
  // to the whole state
  const intermediateState = spliceBusinessLogic(state, action, ...args);

  // do more stuff here
  const extraBusinessLogic = dbLevelBusinessLogicReducers[action.type];

  try {
    return extraBusinessLogic(intermediateState, action, ...args);
  } catch (e) {
    return intermediateState;
  }
};
