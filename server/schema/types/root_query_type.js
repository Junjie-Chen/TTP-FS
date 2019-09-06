const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLList, GraphQLNonNull } = graphql;
const DirectoryType = require('./directory_type');
const UserType = require('./user_type');
const AccountType = require('./account_type');
const mongoose = require('mongoose');
const Account = mongoose.model('Account');
const iex = require('../../services/iex');

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    directory: {
      type: new GraphQLList(DirectoryType),
      resolve: async (parentValue, args) => {
        let date = new Date();
        let month = String(date.getMonth() + 1);
        let day = String(date.getDate());
        const year = date.getFullYear();

        if (month.length < 2) {
          month = `0${month}`;
        }

        if (day.length < 2) {
          day = `0${day}`;
        }

        date = `${year}${month}${day}`;

        const directory = await iex.get(`/ref-data/daily-list/symbol-directory/${date}`)
          .then(res => res.data);

        return directory;
      }
    },
    user: {
      type: UserType,
      resolve(parentValue, args, req) {
        return req.user;
      }
    },
    account: {
      type: AccountType,
      args: { accountId: { type: new GraphQLNonNull(GraphQLID) }},
      resolve(parentValue, { accountId }) {
        return Account.findById(accountId);
      }
    }
  }
});

module.exports = RootQueryType;
