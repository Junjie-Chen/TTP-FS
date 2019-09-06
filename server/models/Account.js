const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const iex = require('../services/iex');

const accountSchema = new Schema({
  balance: {
    type: Number,
    default: 5000
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Transaction'
    }
  ],
  portfolios: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Portfolio'
    }
  ]
});

accountSchema.statics.findUser = function(id) {
  return this.findById(id)
    .populate('user')
    .then(account => account.user);
};

accountSchema.statics.findTransactions = function(id) {
  return this.findById(id)
    .populate('transactions')
    .then(account => account.transactions);
};

accountSchema.statics.findPortfolios = function(id) {
  return this.findById(id)
    .populate('portfolios')
    .then(account => {
      return Promise.all(account.portfolios.map(async portfolio => {
        const quote = await iex.get('/tops/last', {
            params: { symbols: portfolio.symbol }
          })
          .then(res => res.data);

        const price = quote[0].price;

        const ohlc = await iex.get(`/stock/${portfolio.symbol}/ohlc`)
          .then(res => res.data);

        const open = ohlc.open.price;

        if (price < open) {
          portfolio.performance = 'weak';
        }

        if (price === open) {
          portfolio.performance = 'normal';
        }

        if (price > open) {
          portfolio.performance = 'strong';
        }

        const values = (price * portfolio.shares).toFixed(2);

        portfolio.values = values;

        return portfolio;
      }))
      .then(portfolios => portfolios);
    });
};

accountSchema.statics.addTransaction = async function(id, symbol, shares) {
  if (!symbol) {
    throw new Error('You must provide a symbol.');
  }

  if (!shares) {
    throw new Error('You must provide shares.');
  }

  if (!Number.isInteger(shares)) {
    throw new Error('You provided an invalid quantity.');
  }

  const quotes = await iex.get('/tops/last')
    .then(res => res.data);

  const symbols = quotes.map(quote => quote.symbol);

  if (!symbols.includes(symbol)) {
    throw new Error('You provided an invalid ticker symbol.');
  }

  const quote = await iex.get('/tops/last', {
      params: { symbols: symbol }
    })
    .then(res => res.data);

  const price = quote[0].price;

  const values = (price * shares).toFixed(2);

  return this.findById(id)
    .then(account => {
      if (account.balance < values) {
        throw new Error('You don\'t have enough cash in your account.');
      }

      account.balance = account.balance - values;

      const Transaction = mongoose.model('Transaction');

      const transaction = new Transaction({ symbol, shares, price, account });

      account.transactions.push(transaction);

      return Promise.all([ account.save(), transaction.save() ])
        .then(([ account, transaction ]) => account);
    });
};

accountSchema.statics.addPortfolio = async function(id, symbol, shares) {
  return this.findById(id)
    .then(account => {
      return new Promise((resolve, reject) => {
        const Portfolio = mongoose.model('Portfolio');

        Portfolio.findOne({ symbol }, (err, existingPortfolio) => {
          if (err) {
            reject(err);
          }

          if (!existingPortfolio) {
            const portfolio = new Portfolio({ symbol, shares, account });

            account.portfolios.push(portfolio);

            return Promise.all([ account.save(), portfolio.save() ])
              .then(([ account, portfolio ]) => resolve(account));
          }

          existingPortfolio.updateOne({ $inc: { shares } }, (err, res) => {
            if (err) {
              reject(err);
            }

            existingPortfolio.shares = existingPortfolio.shares + shares;

            account.portfolios = account.portfolios.map(portfolio => {
              if (portfolio.id === existingPortfolio.id) {
                portfolio = existingPortfolio;
              }

              return portfolio;
            });

            resolve(account);
          });
        });
      });
    });
};

mongoose.model('Account', accountSchema);
