import React from 'react';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { clearResults } from '../actions/studyActions';

import { fetchCardsForDeckIfNeeded } from '../actions/deckActions';

import StudyCard from '../components/StudyCard';

import api from '../api';

@connect(state => ({
  decks: state.db.decks.data,
  cards: state.db.cards.data,
  results: state.db.results,
}))
export default class StudyPageContainer extends React.Component {
  // DRY, this currently has a lot of code duplicated across the Deck pages
  // that could be better managed by a facility that handles object
  // normalization in a more sophisticated way
  constructor(...args) {
    super(...args);

    this.state = {
      derivationRevealedStep: 0,
      currentCard: null,
    };
  }

  handleAssess = (assessment) => {
    this.props.dispatch(api.cards.assess(null, {
      body: { id: this.state.currentCard, assessment },
    }));
  }

  attemptToFocusCard() {
    // only try to focus a card if it is necessary
    if (this.state.currentCard === null) {
      const deck = this.deck;
      if (!deck) {
        return;
      }

      try {
        const schedule = deck.schedule;
        if (!_.isArray(schedule)) {
          return;
        }
        if (schedule.length === 0) {
          // no cards left! ship us back to the decklist
          // so long as the schedule is up to date
          // TODO
          this.props.dispatch(push(`/app/decks/`));
        }
        this.setState({
          currentCard: _.first(schedule) || null,
        });
      } catch (e) {
        console.log(e);
        // data isn't ready for some reason, so we will try again later
      }
    }
  }

  reset() {
    this.setState({
      derivationRevealedStep: 0,
      currentCard: null,
    });

    this.attemptToFocusCard();
  }

  componentWillReceiveProps(nextProps) {
    if (this.deckId !== _.parseInt(nextProps.routeParams.deckId) &&
        _.isNumber(_.parseInt(nextProps.routeParams.deckId))) {
          this.reset();
    } else {
      this.attemptToFocusCard();
    }
  }

  componentDidMount() {
    this.props.dispatch(clearResults());
    this.attemptToFocusCard();
  }


  get deckId() {
    return _.parseInt(this.props.routeParams.deckId);
  }

  get deck() {
    const deck = _.cloneDeep(this.props.decks[this.deckId]);

    // attach the cards for the deck
    if (deck) {
      deck.cards = _.map(deck.cards, id => this.props.cards[id]);
    }

    return deck;
  }

  get card() {
    if (this.state.currentCard === null) {
      return;
    }

    return this.props.cards[this.state.currentCard];
  }

  isLoading() {
    const deck = this.deck;
    if (_.isUndefined(deck)) {
      return true;
    }

    // don't return anything yet if we are missing cards for some reason
    if (_.some(deck.cards, _.isUndefined)) {
      // request cards for deck if necessary
      this.props.dispatch(fetchCardsForDeckIfNeeded(deck));
      return true;
    }

    if (!this.card) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    if (this.deck) {
      this.props.dispatch(fetchCardsForDeckIfNeeded(this.deck));
    }
  }

  renderLoading() {
    return (
      <p>Loading...</p>
    );
  }

  render() {
    const deck = this.deck;
    const card = this.card;

    if (this.isLoading()) {
      return this.renderLoading();
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            Studying {deck.title} on card {card.id}
            <StudyCard card={this.card} onAssess={this.handleAssess} />
          </div>
        </div>
      </div>
    );
  }
}
