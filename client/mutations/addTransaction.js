import gql from 'graphql-tag';

export default gql`
  mutation AddTransaction($accountId: ID!, $symbol: String, $shares: Int) {
    addTransaction(accountId: $accountId, symbol: $symbol, shares: $shares) {
      id
      balance
    }
  }
`;
