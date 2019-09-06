import gql from 'graphql-tag';

export default gql`
  mutation AddAccount($userId: ID!) {
    addAccount(userId: $userId) {
      id
    }
  }
`;
