import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import * as compose from 'lodash.flowright';
import userQuery from '../queries/user';
import addTransactionMutation from '../mutations/addTransaction';
import addPortfolioMutation from '../mutations/addPortfolio';
import Header from './Header';

class Portfolio extends Component {
  constructor(props) {
    super(props);

    this.state = {
      symbol: '',
      shares: 0,
      errors: []
    };
  }

  onSubmit = event => {
    event.preventDefault();

    const accountId = this.props.data.user.account.id;

    const { symbol, shares } = this.state;

    this.props.addTransaction({
      variables: {
        accountId,
        symbol,
        shares
      }
    })
    .then(res => {
      this.props.addPortfolio({
        variables: {
          accountId,
          symbol,
          shares
        },
        refetchQueries: [
          { query: userQuery }
        ]
      });

      this.setState({
        symbol: '',
        shares: 0,
        errors: []
      });
    })
    .catch(res => {
      const errors = res.graphQLErrors.map(error => error.message);

      this.setState({ errors });
    });
  };

  renderPortfolio() {
    const { loading, user } = this.props.data;

    if (loading) {
      return null;
    }

    const { account } = user;
    const { portfolios } = account;

    const sum = portfolios.reduce((values, portfolio) => values + portfolio.values, 0)
      .toFixed(2);

    return (
      <ul className="collection with-header col s8">
        <li className="collection-header">
          <h4>Portfolio (${sum})</h4>
        </li>
        {
          portfolios.map(({ id, symbol, shares, values, performance }) => {
            const suffix = shares > 1 ? 'Shares' : 'Share';

            return (
              <li key={id} className="collection-item">
                <div>
                  <span className={`${performance}`}>{symbol}</span> - {shares} {suffix}
                  <div className="secondary-content">
                    <span className={`${performance}`}>${values}</span>
                  </div>
                </div>
              </li>
            );
          })
        }
      </ul>
    );
  }

  renderPurchaseForm() {
    const { loading, user } = this.props.data;

    if (loading) {
      return null;
    }

    const { account } = user;

    const balance = account.balance.toFixed(2);

    return (
      <form onSubmit={this.onSubmit} className="col s4">
        <h4 className="heading">Cash - ${balance}</h4>
        <div className="input-field">
          <input
            type="text"
            id="symbol"
            value={this.state.symbol}
            onChange={event => this.setState({ symbol: event.target.value.toUpperCase() })}
          />
          <label className="active" htmlFor="symbol">Symbol</label>
        </div>
        <div className="input-field">
          <input
            type="number"
            id="shares"
            min="0"
            value={this.state.shares}
            onChange={event => this.setState({ shares: parseInt(event.target.value, 10) })}
          />
          <label className="active" htmlFor="shares">Shares</label>
        </div>
        <div className="errors">
          {this.state.errors.map(error => <div key={error}>{error}</div>)}
        </div>
        <button type="submit" className="btn">Buy</button>
      </form>
    );
  }

  render() {
    return (
      <div>
        <Header />
        <div className="row">
          {this.renderPortfolio()}
          {this.renderPurchaseForm()}
        </div>
      </div>
    );
  }
}

export default compose([
  graphql(addPortfolioMutation, { name: 'addPortfolio' }),
  graphql(addTransactionMutation, { name: 'addTransaction' }),
  graphql(userQuery)
])(Portfolio);
