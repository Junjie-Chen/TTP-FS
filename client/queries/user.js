import gql from 'graphql-tag';

export default gql`
  {
    user {
      id
      name
      account {
        id
        balance
        transactions {
          id
          symbol
          shares
          price
        }
        portfolios {
          id
          symbol
          shares
          values
          performance
        }
      }
    }
  }
`;
