export const decksSelector = (state) => state.getIn(['db', 'decks', 'data']);
export const cardsSelector = (state) => state.getIn(['db', 'cards', 'data']);
export const usersSelector = (state) => state.getIn(['db', 'users', 'data']);
export const meSelector = (state) => state.getIn(['db', 'me', 'data']);
export const studySelector = (state) => state.getIn(['db', 'study']);

export default {
  decks: decksSelector,
  cards: cardsSelector,
  users: usersSelector,
  me: meSelector,
  study: studySelector,
};
