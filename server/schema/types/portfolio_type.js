const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLFloat, GraphQLNonNull } = graphql;
const AccountType = require('./account_type');
const mongoose = require('mongoose');
const Portfolio = mongoose.model('Portfolio');

const PortfolioType = new GraphQLObjectType({
  name: 'PortfolioType',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    symbol: { type: GraphQLString },
    shares: { type: GraphQLInt },
    values: { type: GraphQLFloat },
    performance: { type: GraphQLString },
    account: {
      type: AccountType,
      resolve(parentValue, args) {
        return Portfolio.findAccount(parentValue.id);
      }
    }
  })
});

module.exports = PortfolioType;
