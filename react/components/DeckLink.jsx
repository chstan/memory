import React from 'react';

import { Link } from 'react-router';

export default class DeckLink extends React.Component {
  decks() {
    return _.values(this.props.decks.items);
  }

  render() {
    const { id, title, due_today_count } = this.props.deck;
    return (
      <div>
        <span>{title}</span>
        <Link to={`/app/decks/deck/${this.props.deck.id}`}>
          <span>View</span>
        </Link>
        <Link to={`/app/decks/deck/${this.props.deck.id}/study`}>
          { due_today_count } due
        </Link>
      </div>

    );
  }
}
