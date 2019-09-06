import gql from 'graphql-tag';

export default gql`
  mutation AddPortfolio($accountId: ID!, $symbol: String, $shares: Int) {
    addPortfolio(accountId: $accountId, symbol: $symbol, shares: $shares) {
      id
      balance
    }
  }
`;
