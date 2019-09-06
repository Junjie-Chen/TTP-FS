import gql from 'graphql-tag';

export default gql`
  mutation SignIn($email: String, $password: String) {
    signIn(email: $email, password: $password) {
      id
    }
  }
`;
