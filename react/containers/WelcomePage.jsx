import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import LoginForm from '../components/forms/LoginForm';
import { authLoginUser } from '../actions/authActions';

@connect(state => ({
  me: state.db.me.data,
}))
export default class WelcomePage extends React.Component {
  handleSubmit = (data) => {
    this.props.dispatch(authLoginUser(data.username, data.password));
  }

  render() {
    let welcomeBanner = <LoginForm.form onSubmit={this.handleSubmit} />;
    if (_.get(this.props.me, 'email')) {
      welcomeBanner = <p>Welcome { this.props.me.email }!</p>;
    }

    return (
      <div>
        {welcomeBanner}
      </div>
    );
  }
}
