import React from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';

import sel from '../selector';

@connect(state => ({
  decks: sel.decks(state),
  cards: sel.cards(state),
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
