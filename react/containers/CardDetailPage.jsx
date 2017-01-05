import React from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';

@connect(state => ({
  decks: state.db.decks.data,
  cards: state.db.cards.data,
}))
export default class CardDetailPage extends React.Component {
  render() {
    return (
      <div className="container">
        <p>Deck is {this.props.routeParams.deckId}</p>
        <p>Card is {this.props.routeParams.cardId}</p>
      </div>
    );
  }
}
