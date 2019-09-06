import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import * as compose from 'lodash.flowright';
import userQuery from '../queries/user';
import signOutMutation from '../mutations/signOut';

class Navbar extends Component {
  onSignOut = () => {
    this.props.mutate({
      refetchQueries: [
        { query: userQuery }
      ]
    });
  };

  renderLinks() {
    const { loading, user } = this.props.data;

    if (loading) {
      return null;
    }

    if (user) {
      return (
        <ul className="right">
          <li>
            <a onClick={this.onSignOut}>Sign Out</a>
          </li>
        </ul>
      );
    } else {
      return (
        <ul className="right">
          <li>
            <Link to="/account/new">Sign Up</Link>
          </li>
          <li>
            <Link to="/account/existing">Sign In</Link>
          </li>
        </ul>
      );
    }
  }

  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <Link to="/" className="brand-logo">Stock</Link>
          {this.renderLinks()}
        </div>
      </nav>
    );
  }
}

export default compose([
    graphql(signOutMutation),
    graphql(userQuery)
])(Navbar);
