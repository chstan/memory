import React from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';

import SignupForm from '../components/forms/SignupForm';
import { authSignupUser } from '../actions/authActions';

@connect()
export default class SignupPage extends React.Component {
  handleSubmit = (data) => {
    data.username = data.email;
    this.props.dispatch(authSignupUser(_.omit(data, ['confirmation'])));
  }

  render() {
    return (
      <div className="container">
        <SignupForm.form onSubmit={this.handleSubmit} />
      </div>
    );
  }
};
