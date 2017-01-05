import React from 'react';
import ReactPaginate from 'react-paginate';

import CardBrief from './CardBrief';

class CardList extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      offset: 0,
    };
  }

  handlePageClick = (data) => {
    const selected = data.selected;
    const offset = Math.ceil(selected * this.props.perPage);

    this.setState({ offset, });
  }
  viewedCards() {
    return _.slice(this.props.cards, this.state.offset,
                   this.state.offset + this.props.perPage);
  }
  render() {
    const cardNodes = this.viewedCards().map(
      card => <li key={card.id}><CardBrief card={card} /></li>);

    return (
      <div>
        <ul>
          {cardNodes}
        </ul>
        <ReactPaginate previousLabel={"previous"}
                       nextLabel={"next"}
                       breakLabel={<a href="#">...</a>}
                       breakClassName={"break-me"}
                       pageCount={Math.ceil(
                       this.props.cards.length / this.props.perPage)}
                       marginPagesDisplayed={2}
                       pageRangeDisplayed={5}
                       onPageChange={this.handlePageClick}
                       containerClassName={"pagination"}
                       subContainerClassName={"pages pagination"}
                       activeClassName={"active"} />
      </div>
    );
  }
}

CardList.propTypes = {
  perPage: React.PropTypes.number,
};

CardList.defaultProps = {
  perPage: 10,
};

export default CardList;
