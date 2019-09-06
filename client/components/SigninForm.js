import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import * as compose from 'lodash.flowright';
import AuthForm from './AuthForm';
import userQuery from '../queries/user';
import signInMutation from '../mutations/signIn';

class SigninForm extends Component {
  constructor(props) {
    super(props);

    this.state = { errors: [] };
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (!prevProps.data.user && this.props.data.user) {
      this.props.history.push('/account/portfolio');
    }

    return this.props.data.user;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot) {
      return snapshot;
    }
  }

  onSubmit = ({ email, password }) => {
    this.props.mutate({
      variables: {
        email,
        password
      },
      refetchQueries: [
        { query: userQuery }
      ]
    })
    .then(res => this.setState({ errors: [] }))
    .catch(res => {
      const errors = res.graphQLErrors.map(error => error.message);

      this.setState({ errors });
    });
  };

  render() {
    return (
      <div>
        <h3>Sign In</h3>
        <AuthForm
          errors={this.state.errors}
          onSubmit={this.onSubmit}
        />
      </div>
    );
  }
}

export default compose([
    graphql(signInMutation),
    graphql(userQuery)
])(SigninForm);
