import React from 'react';
import { push } from 'react-router-redux';

import KeyListener from './abstract/KeyListener';

import { Link } from 'react-router';

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

  render() {
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
          </div>
        </div>
      </nav>
    );
  }
};

Navbar.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
};
