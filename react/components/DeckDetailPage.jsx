import React from 'react';
import KeyListener from './abstract/KeyListener';

import { push } from 'react-router-redux';
import { connect } from 'react-redux';

import { Link } from 'react-router';

import { fetchCardsForDeckIfNeeded } from '../actions/deckActions';

import CardList from './CardList';

import api from '../api';
import sel from '../selector';

@connect(state => ({
  decks: sel.decks(state),
  cards: sel.cards(state),
}))
export default class DeckDetail extends KeyListener {
  get deckId() {
    return this.props.routeParams.deckId;
  }

  get deck() {
    let deck = this.props.decks.get(this.deckId);

    // attach the cards for the deck
    if (deck) {
      deck = deck.updateIn(['cards'], cids => cids.map(cid => {
        return this.props.cards.get(String(cid));
      }));
    }

    return deck;
  }

  goToAddCardPage = () => {
    this.props.dispatch(push(`/app/decks/deck/${this.deckId}/add`));
  }

  componentDidMount() {
    this.registerKeyCombination('tab a', this.goToAddCardPage);
  }

  isLoading() {
    const deck = this.deck;
    if (_.isUndefined(deck)) {
      return true;
    }

    // don't return anything yet if we are missing cards for some reason
    if (_.some(deck.toJS().cards, _.isUndefined)) {
      this.props.dispatch(fetchCardsForDeckIfNeeded(
        this.props.decks.get(this.deckId)));
      return true;
    }

    return false;
  }

  handleDeleteDeck = () => {
    this.props.dispatch(api.decks.delete(this.deck.toJS()));
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
        <CardList cards={deck.toJS().cards} />
        <Link className="btn btn-default" role="button" to={`/app/decks/deck/${this.deckId}/add`}><u>A</u>dd a card</Link>
        <button className="btn btn-danger" onClick={this.handleDeleteDeck}>Delete Deck</button>
      </div>
    );
  }
}
