import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import userQuery from '../queries/user';

export default WrappedComponent => {
  class RequireAuth extends Component {
    getSnapshotBeforeUpdate(prevProps, prevState) {
      if (!this.props.data.loading && !this.props.data.user) {
        this.props.history.push('/');
      }

      return this.props.data.user;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      if (snapshot) {
        return snapshot;
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return graphql(userQuery)(RequireAuth);
};
