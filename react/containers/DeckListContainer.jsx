import React from 'react';

import { Link } from 'react-router';
import { connect } from 'react-redux';

import DeckLink from '../components/DeckLink';

@connect(state => ({
  decks: state.db.decks.data,
}))
export default class DeckListContainer extends React.Component {
  handleClick() {
    let {dispatch} = this.props;
    dispatch(counterActions.increaseCounter());
  }

  decks() {
    return _.values(this.props.decks);
  }

  render() {
    const deckLinks = this.decks().map(d =>
      <li key={d.id}>
        <DeckLink deck={d}/>
      </li>
    );

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <h1>Decks</h1>
            <ul>
              {deckLinks}
            </ul>
            <Link to="/app/decks/add">Add a Deck</Link>
          </div>
        </div>
      </div>
    );
  }
}
