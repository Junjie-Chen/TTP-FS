const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  }
});

userSchema.statics.findAccount = function(id) {
  return this.findById(id)
    .populate('account')
    .then(user => user.account);
};

userSchema.statics.addAccount = function(id) {
  return this.findById(id)
    .then(user => {
      const Account = mongoose.model('Account');

      const account = new Account({ user });

      user.account = account;

      return Promise.all([ user.save(), account.save() ])
        .then(([ user, account ]) => user);
    });
};

// The user's password is never stored in plain text. Prior to saving the user model,
// we salt and hash the user's password. This is a one-way process
// that modifies the password as the plain text password can't be
// derived from the salted and hashed version. See the comparePassword method below
// to understand how this is used.
userSchema.pre('save', function save(next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      user.password = hash;

      next();
    });
  });
});

// We need to compare the plain text password that is submitted whenever a user
// attempts to sign in with the hashed version that is stored in MongoDB.
// The bcrypt.compare method takes the plain text password and hashes it, then compares
// that hashed password to the one that is stored in MongoDB. Remember that hashing is
// a one-way process as the password is never compared in the plain text form.
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => cb(err, isMatch));
};

mongoose.model('User', userSchema);
