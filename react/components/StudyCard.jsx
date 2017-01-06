import React from 'react';
import KeyListener from './abstract/KeyListener';

import Markdown from './Markdown';

export default class StudyCard extends KeyListener {
  constructor(...args) {
    super(...args);

    this.state = {
      assessed: false,
      revealed: false,
      derivationRevealedStep: 0,
    };
  }

  componentDidMount() {
    this.registerKeyCombination('tab h', this.handleReveal);
    _.range(6).forEach(i => {
      this.registerKeyCombination(`${i}`, this.handleAssess.bind(this, i));
    });
  }

  handleAssess = (assessment) => {
    // block assessment unless you showed the card, this makes
    // handling key combinations a bit easier
    if (!this.state.revealed) return;

    this.setState({
      assessed: true,
    });
    this.props.onAssess(assessment);
  }

  handleReveal = () => {
    this.setState({
      revealed: true,
    });
  }

  render() {
    const buttonClasses = [
      'btn-danger',
      'btn-warning',
      'btn-warning',
      'btn-success',
      'btn-success',
      'btn-success'
    ];

    const revealButton = (
      <button type='button'
              className="btn btn-primary" onClick={this.handleReveal}>
        S<u>h</u>ow
      </button>
    );
    const assessButton = value => {
      return (
        <button disabled={this.state.assessed} key={value}
                className={`btn ${buttonClasses[value]}`}
                onClick={this.handleAssess.bind(this, value)}>
          <u>{value}</u>
        </button>
      );
    };
    const assessCardPanel = (
      <div className="btn-group">
        {_.map(_.range(6), assessButton)}
      </div>
    );

    return (
      <div>
        <Markdown source={this.props.card.front} />
        { this.state.revealed && <Markdown source={this.props.card.back} />}
        { this.state.revealed && assessCardPanel }
        { !this.state.revealed && revealButton }
      </div>

    );
  }
};

StudyCard.propTypes = {
  card: React.PropTypes.object.isRequired,
  onAssess: React.PropTypes.func.isRequired,
};
