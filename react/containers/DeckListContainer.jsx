import React from 'react';
import KeyListener from '../components/abstract/KeyListener';

import { push } from 'react-router-redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import DeckLink from '../components/DeckLink';

import sel from '../selector';

@connect(state => ({
  decks: sel.decks(state),
}))
export default class DeckListContainer extends KeyListener {
  handleClick() {
    let {dispatch} = this.props;
    dispatch(counterActions.increaseCounter());
  }

  goToAddDeckPage = () => {
    this.props.dispatch(push('/app/decks/add'));
  }

  componentDidMount() {
    this.registerKeyCombination('tab a', this.goToAddDeckPage)
  }

  decks() {
    return _.values(this.props.decks.toJS());
  }

  render() {
    const deckLinks = this.decks().map(d =>
      <li key={d.id} className="list-group-item">
        <DeckLink deck={d}/>
      </li>
    );

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <h1>Decks</h1>
            <ul className="list-group">
              {deckLinks}
            </ul>
            <Link to="/app/decks/add"><u>A</u>dd a Deck</Link>
          </div>
        </div>
      </div>
    );
  }
}
