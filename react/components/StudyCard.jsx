import React from 'react';

import Markdown from './Markdown';

export default class StudyCard extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      assessed: false,
      revealed: false,
      derivationRevealedStep: 0,
    };
  }

  handleAssess = (assessment) => {
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
        Show
      </button>
    );
    const assessButton = value => {
      return (
        <button disabled={this.state.assessed} key={value}
                className={`btn ${buttonClasses[value]}`}
                onClick={this.handleAssess.bind(this, value)}>
          {value}
        </button>
      );
    };
    const assessCardPanel = (
      <div>
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
