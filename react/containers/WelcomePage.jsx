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
        <div className="section">
          <h2>Some helpful tips</h2>
          <p>
            LaTeX support is available in cards via KaTeX. You can start and
            end an environment with $$, or with one of \\[ \\( as appropriate.
          </p>
          <p>
            There are also a number of shortcuts available, generally off of the
            Tab key. Navigation related shortcuts are all prefixed by Tab and
            are indicated by an underlined letter on links.

            On the study page, you can also use the 0 to 5 keys in order to
            submit a rating on a card that was just revealed.
          </p>
        </div>
      </div>
    );
  }
}
