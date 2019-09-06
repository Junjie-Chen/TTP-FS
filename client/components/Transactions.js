import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import userQuery from '../queries/user';
import Header from './Header';

class Transactions extends Component {
  renderTransactions() {
    const { loading, user } = this.props.data;

    if (loading) {
      return null;
    }

    const { account } = user;
    const { transactions } = account;

    return (
      <ul className="collection with-header col s6">
        <li className="collection-header">
          <h4>Transactions</h4>
        </li>
        {
          transactions.map(({ id, symbol, shares, price }) => {
            const suffix = shares > 1 ? 'Shares' : 'Share';

            return (
              <li key={id} className="collection-item">BUY ({symbol}) - {shares} {suffix} @ {price}</li>
            );
          })
        }
      </ul>
    );
  }

  render() {
    return (
      <div>
        <Header />
        <div className="row">
          {this.renderTransactions()}
        </div>
      </div>
    );
  }
}

export default graphql(userQuery)(Transactions);
