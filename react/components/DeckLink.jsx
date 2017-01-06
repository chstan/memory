import React from 'react';

import { Link } from 'react-router';

export default class DeckLink extends React.Component {
  decks() {
    return _.values(this.props.decks.items);
  }

  render() {
    const { id, title, due_today_count } = this.props.deck;
    const studyLink = (
      <div className="pull-right">
        <Link to={`/app/decks/deck/${this.props.deck.id}/study`}
              className="btn btn-primary btn-xs" role="button">
          Study &nbsp;
          <span className="badge">{ due_today_count }</span>
        </Link>
      </div>
    );
    return (
      <div>
        <Link to={`/app/decks/deck/${this.props.deck.id}`}>
          <span>{title}</span>
        </Link>
        { due_today_count > 0 && studyLink }
      </div>
    );
  }
}
