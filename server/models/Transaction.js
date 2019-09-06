const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  symbol: String,
  shares: Number,
  price: Number,
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  }
});

transactionSchema.statics.findAccount = function(id) {
  return this.findById(id)
    .populate('account')
    .then(transaction => transaction.account);
};

mongoose.model('Transaction', transactionSchema);
