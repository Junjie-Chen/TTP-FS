const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

// The serializeUser method is used to provide an identifying token that can be saved
// in the server's session. We traditionally use the user's id for this.
passport.serializeUser((user, done) => done(null, user.id));

// The counterpart of the serializeUser method. Given the user's id, we can return
// the user object. This object is placed on the req.user property.
passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)));

// Instructs Passport how to authenticate a user using a locally saved email and
// password combination. This strategy is called whenever a user attempts to
// sign in. We first find the User model in MongoDB that matches the provided email,
// then check to see if the provided password matches the saved password. There
// are two authentication failure here: the email doesn't exist, or the password
// doesn't match the saved one in the database. In either case, we call the done
// callback, including an error message that tells why the authentication process failed.
// The error message is provided back to the GraphQL client.
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  email = email.toLowerCase();

  User.findOne({ email }, (err, user) => {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false, 'You provided an incorrect email.');
    }

    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        return done(err);
      }

      if (isMatch) {
        return done(null, user);
      }

      return done(null, false, 'You provided an incorrect password.');
    });
  });
}));

// Signs up a new user. We first check to see if a user already exists with
// the provided email to avoid creating multiple users with the identical emails.
// If the new user does not exist, we save the new user. After the new user is created,
// the new user is passed to the req.logIn method. This is a part of Passport.
// Notice a promise is created in the second then method. This is done
// because Passport only supports callbacks while GraphQL only supports promises
// for asynchronous operation.
const signUp = ({ name, email, password, req }) => {
  if (!name) {
    throw new Error('You must provide a name.');
  }

  if (!email) {
    throw new Error('You must provide an email.');
  }

  if (!password) {
    throw new Error('You must provide a password.');
  }

  return User.findOne({ email })
    .then(existingUser => {
      if (existingUser) {
        throw new Error('The provided email is in use.');
      }

      const user = new User({ name, email, password });

      return user.save();
    })
    .then(user => {
      return new Promise((resolve, reject) => {
        req.logIn(user, err => {
          if (err) {
            reject(err);
          }

          resolve(user);
        });
      });
    });
};

// Signs in an existing user. This will invoke the LocalStrategy that is defined above.
// Notice the unusual method signature here: the passport.authenticate method
// returns a function as it's intended to be used as a middleware in Express.
// We created another promise here to make it work nicely with GraphQL
// as GraphQL always expects a promise for handling asynchronous operation.
const signIn = ({ email, password, req }) => {
  if (!email) {
    throw new Error('You must provide an email.');
  }

  if (!password) {
    throw new Error('You must provide a password.');
  }

  return new Promise((resolve, reject) => {
    passport.authenticate('local', (err, user) => {
      if (err) {
        reject(err);
      }

      if (!user) {
        reject(new Error('You provided an incorrect email or password.'));
      }

      req.logIn(user, err => {
        if (err) {
          reject(err);
        }

        resolve(user);
      });
    })({
      body: {
        email,
        password
      }
    });
  });
};

module.exports = {
  signUp,
  signIn
};
