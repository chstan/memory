import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { fetchDecksIfNeeded } from '../actions/deckActions';
import { fetchProfileIfNeeded } from '../actions/userActions';

import Headline from '../components/Headline';

@connect()
export default class AppContainer extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchDecksIfNeeded());
    dispatch(fetchProfileIfNeeded());
  }

  render() {
    let {counters} = this.props;
    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <Link to="/app/" className="navbar-brand">Main</Link>
            </div>
            <div className="collapse navbar-collapse">
              <ul className="nav navbar-nav">
                <li>
                  <Link to="/app/decks/">Decks</Link>
                </li>
                <li>
                  <Link to="/app/statistics/">Statistics</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {this.props.children}
      </div>
    );
  }
}
