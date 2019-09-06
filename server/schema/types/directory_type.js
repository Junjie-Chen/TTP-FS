const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull } = graphql;

const DirectoryType = new GraphQLObjectType({
  name: 'DirectoryType',
  fields: () => ({
    RecordID: { type: new GraphQLNonNull(GraphQLID) },
    SymbolinINETSymbology: { type: GraphQLString },
    SecurityName: { type: GraphQLString },
    CompanyName: { type: GraphQLString },
    PreviousOfficialClosingPrice: { type: GraphQLString },
    FirstDateListed: { type: GraphQLString },
    CountryofIncorporation: { type: GraphQLString }
  })
});

module.exports = DirectoryType;
