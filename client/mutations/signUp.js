import gql from 'graphql-tag';

export default gql`
  mutation SignUp($name: String, $email: String, $password: String) {
    signUp(name: $name, email: $email, password: $password) {
      id
    }
  }
`;
