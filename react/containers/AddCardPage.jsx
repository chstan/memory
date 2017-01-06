import React from 'react';
import { connect } from 'react-redux';

import { toastr } from 'react-redux-toastr';

import { formValueSelector, reset } from 'redux-form';
import _ from 'lodash';

import CreateCardForm from '../components/forms/CreateCardForm';
import { scheduleDecks } from '../actions/deckActions';

import api from '../api';
import sel from '../selector';

const createCardSelector = formValueSelector('create-card'); // a cursor

@connect(state => ({
  decks: sel.decks(state),
  // monitor this, this might not be performant
  card_type: createCardSelector(state.toJS(), 'card_type'),
  front: createCardSelector(state.toJS(), 'front'),
  back: createCardSelector(state.toJS(), 'back'),
}))
export default class AddCardPage extends React.Component {
  handleSubmit = (card) => {
    card.deck = _.parseInt(this.props.routeParams.deckId);
    this.props.dispatch(api.cards.post({}, {
      body: card,
      then: () => {
        toastr.success('Card created');
        this.props.dispatch(scheduleDecks(new Set([card.deck])));
        this.props.dispatch(reset('create-card'));
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
