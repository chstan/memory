import React from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router';

import { fetchCardsForDeckIfNeeded } from '../actions/deckActions';

import CardList from './CardList';

import api from '../api';

@connect(state => ({
  decks: state.db.decks.data,
  cards: state.db.cards.data,
}))
export default class DeckDetail extends React.Component {
  get deckId() {
    return _.parseInt(this.props.routeParams.deckId);
  }

  get deck() {
    const deck = _.cloneDeep(_.find(this.props.decks, d => d.id === this.deckId));

    // attach the cards for the deck
    if (deck) {
      deck.cards = _.map(deck.cards, id => this.props.cards[id]);
    }

    return deck;
  }

  isLoading() {
    const deck = this.deck;
    if (_.isUndefined(deck)) {
      return true;
    }

    // don't return anything yet if we are missing cards for some reason
    if (_.some(deck.cards, _.isUndefined)) {
      this.props.dispatch(fetchCardsForDeckIfNeeded(deck));
      return true;
    }

    return false;
  }

  handleDeleteDeck = () => {
    this.props.dispatch(api.decks.delete(this.deck));
  }

  renderLoading() {
    return (
      <p>Loading...</p>
    );
  }

  render() {
    const deck = this.deck;

    if (this.isLoading()) {
      return this.renderLoading();
    }

    return (
      <div>
        <h1>{deck.title}</h1>
        <CardList cards={deck.cards} />
        <Link className="btn btn-default" role="button" to={`/app/decks/deck/${this.deckId}/add`}>Add a card</Link>
        <button className="btn btn-danger" onClick={this.handleDeleteDeck}>Delete Deck</button>
      </div>
    );
  }
}
