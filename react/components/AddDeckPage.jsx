import React from 'react';
import { connect } from 'react-redux';

import CreateDeckForm from './forms/CreateDeckForm';

import api from '../api';

@connect()
export default class AddDeckPage extends React.Component {
  handleSubmit = (data) => {
    this.props.dispatch(api.decks.post({}, {body: data,}));
  }

  render() {
    return (
      <div>
        <p>Create Deck</p>
        <CreateDeckForm.form onSubmit={this.handleSubmit} />
      </div>
    );
  }
}
