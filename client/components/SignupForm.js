import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import * as compose from 'lodash.flowright';
import AuthForm from './AuthForm';
import userQuery from '../queries/user';
import signUpMutation from '../mutations/signUp';
import addAccountMutation from '../mutations/addAccount';

class SignupForm extends Component {
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

  onSubmit = ({ name, email, password }) => {
    this.props.signUp({
      variables: {
        name,
        email,
        password
      }
    })
    .then(res => {
      if (res.data.signUp && res.data.signUp.id) {
        this.props.addAccount({
          variables: { userId: res.data.signUp.id },
          refetchQueries: [
            { query: userQuery }
          ]
        });
      }

      this.setState({ errors: [] });
    })
    .catch(res => {
      const errors = res.graphQLErrors.map(error => error.message);

      this.setState({ errors });
    });
  };

  render() {
    return (
      <div>
        <h3>Sign Up</h3>
        <AuthForm
          name="signup"
          errors={this.state.errors}
          onSubmit={this.onSubmit}
        />
      </div>
    );
  }
}

export default compose([
    graphql(addAccountMutation, { name: 'addAccount' }),
    graphql(signUpMutation, { name: 'signUp' }),
    graphql(userQuery)
])(SignupForm);
