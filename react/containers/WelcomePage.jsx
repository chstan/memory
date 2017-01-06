import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import LoginForm from '../components/forms/LoginForm';
import { authLoginUser } from '../actions/authActions';

import sel from '../selector';

@connect(state => ({
  me: sel.me(state),
}))
export default class WelcomePage extends React.Component {
  handleSubmit = (data) => {
    this.props.dispatch(authLoginUser(data.username, data.password));
  }

  render() {
    let welcomeBanner = <LoginForm.form onSubmit={this.handleSubmit} />;
    if (this.props.me.get('email')) {
      welcomeBanner = <p>Welcome { this.props.me.get('email') }!</p>;
    }

    return (
      <div>
        {welcomeBanner}
      </div>
    );
  }
}
