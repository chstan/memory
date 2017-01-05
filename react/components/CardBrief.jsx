import React from 'react';

export default class CardBrief extends React.Component {
  render() {
    return (
      <div>
        <p> {this.props.card.front} </p>
      </div>
    );
  }
}
