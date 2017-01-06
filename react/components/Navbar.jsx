import React from 'react';
import { push } from 'react-router-redux';

import KeyListener from './abstract/KeyListener';

import { Link } from 'react-router';

import auth from '../auth';

import { logout } from '../actions/userActions';

export default class Navbar extends KeyListener {
  goToMain = () => {
    this.props.dispatch(push('/app/'));
  }
  goToDecks = () => {
    this.props.dispatch(push('/app/decks/'));
  }
  goToStatistics = () => {
    this.props.dispatch(push('/app/statistics/'));
  }

  componentDidMount() {
    this.registerKeyCombination('tab m', this.goToMain);
    this.registerKeyCombination('tab d', this.goToDecks);
    this.registerKeyCombination('tab s', this.goToStatistics);
  }

  handleLogout = () => {
    this.props.dispatch(logout());
  }

  render() {
    const logoutButton = (
      <button className="btn btn-default navbar-btn" type="button"
              onClick={this.handleLogout}>
        Logout
      </button>
    );

    const signupButton = (
      // use a button here because otherwise the styles are wonky.
      <button className="btn btn-default navbar-btn" type="button"
         onClick={() => { this.props.dispatch(push('/app/signup/')); }}>
        Signup
      </button>
    );

    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link to="/app/" className="navbar-brand"><u>M</u>ain</Link>
          </div>
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              <li>
                <Link to="/app/decks/"><u>D</u>ecks</Link>
              </li>
              <li>
                <Link to="/app/statistics/"><u>S</u>tatistics</Link>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li>
                { auth.isAuthenticated() ? logoutButton : signupButton }
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
};

Navbar.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
};
