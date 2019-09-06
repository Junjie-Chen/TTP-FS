const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLFloat, GraphQLNonNull } = graphql;
const AccountType = require('./account_type');
const mongoose = require('mongoose');
const Transaction = mongoose.model('Transaction');

const TransactionType = new GraphQLObjectType({
  name: 'TransactionType',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    symbol: { type: GraphQLString },
    shares: { type: GraphQLInt },
    price: { type: GraphQLFloat },
    account: {
      type: AccountType,
      resolve(parentValue, args) {
        return Transaction.findAccount(parentValue.id);
      }
    }
  })
});

module.exports = TransactionType;
