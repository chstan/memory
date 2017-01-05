import React from 'react';
import { connect } from 'react-redux';

import { formValueSelector } from 'redux-form';
import _ from 'lodash';

import CreateCardForm from '../components/forms/CreateCardForm';
import { scheduleDecks } from '../actions/deckActions';

import api from '../api';

const createCardSelector = formValueSelector('create-card'); // a cursor

@connect(state => ({
  decks: state.db.decks.data,
  card_type: createCardSelector(state, 'card_type'),
  front: createCardSelector(state, 'front'),
  back: createCardSelector(state, 'back'),
}))
export default class AddCardPage extends React.Component {
  handleSubmit = (card) => {
    card.deck = _.parseInt(this.props.routeParams.deckId);
    this.props.dispatch(api.cards.post({}, {
      body: card,
      then: () => {
        this.props.dispatch(scheduleDecks(new Set([card.deck])));
      },
    }));
  }

  render() {
    return (
      <div className="container">
        <p>Add Card</p>
        <CreateCardForm.form onSubmit={this.handleSubmit}
                             card_type={this.props.card_type}
                             front={this.props.front}
                             back={this.props.back} />
      </div>
    );
  }
}
