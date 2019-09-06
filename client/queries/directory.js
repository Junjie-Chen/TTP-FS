import gql from 'graphql-tag';

export default gql`
  {
    directory {
      RecordID
      SymbolinINETSymbology
      SecurityName
      CompanyName
      PreviousOfficialClosingPrice
      FirstDateListed
      CountryofIncorporation
    }
  }
`;
