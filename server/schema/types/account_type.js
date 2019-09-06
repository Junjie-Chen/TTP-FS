const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLFloat, GraphQLList, GraphQLNonNull } = graphql;
const mongoose = require('mongoose');
const Account = mongoose.model('Account');

const AccountType = new GraphQLObjectType({
  name: 'AccountType',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    balance: { type: GraphQLFloat },
    user: {
      type: require('./user_type'),
      resolve(parentValue, args) {
        return Account.findUser(parentValue.id);
      }
    },
    transactions: {
      type: new GraphQLList(require('./transaction_type')),
      resolve(parentValue, args) {
        return Account.findTransactions(parentValue.id);
      }
    },
    portfolios: {
      type: new GraphQLList(require('./portfolio_type')),
      resolve(parentValue, args) {
        return Account.findPortfolios(parentValue.id);
      }
    }
  })
});

module.exports = AccountType;
