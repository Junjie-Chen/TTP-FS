import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import userQuery from '../queries/user';

class Header extends Component {
  renderLinks() {
    return (
      <ul className="right">
        <li>
          <Link to="/account/portfolio">Portfolio</Link>
        </li>
        <li>
          <Link to="/account/transactions">Transactions</Link>
        </li>
      </ul>
    );
  }

  render() {
    const { loading, user } = this.props.data;

    if (loading) {
      return null;
    }

    const { name } = user;

    return (
      <nav className="nav-secondary">
        <div className="nav-wrapper">
          <span>Welcome, {name}</span>
          {this.renderLinks()}
        </div>
      </nav>
    );
  }
}

export default graphql(userQuery)(Header);
