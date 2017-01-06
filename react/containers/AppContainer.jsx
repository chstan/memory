import React from 'react';
import { connect } from 'react-redux';

import { fetchDecksIfNeeded } from '../actions/deckActions';
import { fetchProfileIfNeeded } from '../actions/userActions';

import Headline from '../components/Headline';
import Navbar from '../components/Navbar';

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
        <Navbar dispatch={this.props.dispatch} />
        {this.props.children}
      </div>
    );
  }
}
