const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portfolioSchema = new Schema({
  symbol: String,
  shares: Number,
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  }
});

portfolioSchema.statics.findAccount = function(id) {
  return this.findById(id)
    .populate('account')
    .then(portfolio => portfolio.account);
};

mongoose.model('Portfolio', portfolioSchema);
