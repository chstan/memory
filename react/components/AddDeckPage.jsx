import React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { push } from 'react-router-redux';

import CreateDeckForm from './forms/CreateDeckForm';

import api from '../api';


@connect()
export default class AddDeckPage extends React.Component {
  handleSubmit = (data) => {
    this.props.dispatch(api.decks.post({}, {
      body: data,
      then: () => {
        toastr.success(`${data.title}`, 'Created');
        this.props.dispatch(push('/app/decks/'));
      }
    }));
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
