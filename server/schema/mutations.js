const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLNonNull } = graphql;
const UserType = require('./types/user_type');
const AccountType = require('./types/account_type');
const authService = require('../services/auth');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Account = mongoose.model('Account');

const mutations = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signUp: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parentValue, { name, email, password }, req) {
        return authService.signUp({ name, email, password, req });
      }
    },
    signIn: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parentValue, { email, password }, req) {
        return authService.signIn({ email, password, req });
      }
    },
    signOut: {
      type: UserType,
      resolve(parentValue, args, req) {
        const { user } = req;

        req.logOut();

        return user;
      }
    },
    addAccount: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parentValue, { userId }) {
        return User.addAccount(userId);
      }
    },
    addTransaction: {
      type: AccountType,
      args: {
        accountId: { type: new GraphQLNonNull(GraphQLID) },
        symbol: { type: GraphQLString },
        shares: { type: GraphQLInt }
      },
      resolve(parentValue, { accountId, symbol, shares }) {
        return Account.addTransaction(accountId, symbol, shares);
      }
    },
    addPortfolio: {
      type: AccountType,
      args: {
        accountId: { type: new GraphQLNonNull(GraphQLID) },
        symbol: { type: GraphQLString },
        shares: { type: GraphQLInt }
      },
      resolve(parentValue, { accountId, symbol, shares }) {
        return Account.addPortfolio(accountId, symbol, shares);
      }
    }
  }
});

module.exports = mutations;
