const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull } = graphql;
const AccountType = require('./account_type');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    account: {
      type: AccountType,
      resolve(parentValue, args) {
        return User.findAccount(parentValue.id);
      }
    }
  })
});

module.exports = UserType;
