import api from '../api';
import { combineReducers } from 'redux';

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

function assessCardReducer(state, { card, value }) {
  console.log(card);
  console.log(value);

  // TODO implement
  // there are a few basic things that need to happen, we need to determine whether
  // to push the card back onto the schedule and adjust the number of due cards,
  // and we need to clear the scheduled_for field on the card

  // finally we need to push the assessment onto the recent results for
  // the session
  return state;
}

function scheduleDecksReducer(state, { deckIds }) {
  const decks = state.decks.data;
  const cards = state.cards.data;
  const updatedDecks = {};

  const midnight = moment().add(1, 'days').startOf('day');

  deckIds.forEach(id => {
    updatedDecks[id] = {
      schedule: _.chain(decks[id].cards)
                 .map(cid => cards[cid])
                 .filter(card => moment(card.scheduled_for).diff(midnight) < 0)
                 .sortBy(card => moment(card.scheduled_for))
                 .map(card => card.id)
                 .value(),
    };
  });

  // now that we have valid schedules, we don't need to trust the old count of
  // the number of cards due
  deckIds.forEach(id => {
    updatedDecks[id].due_today = updatedDecks[id].schedule.length;
  });

  const updatedState = {
    decks: {
      data: updatedDecks,
    }
  };

  // this could be more efficient but it's reasonably clean
  // use immutable Conrad
  return _.cloneDeep(_.mergeWith(state, updatedState, (o, src) => {
    if (_.isArray(src)) {
      return src;
    }
  }));
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
