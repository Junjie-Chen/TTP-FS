const models = require('./models');
const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const passportConfig = require('./services/auth');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const middleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const config = require('../webpack.config');
const compiler = webpack(config);

const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('../keys');
}

const MONGODB_ATLAS_CONNECTION_STRING = process.env.MONGODB_ATLAS_CONNECTION_STRING;

if (!MONGODB_ATLAS_CONNECTION_STRING) {
  throw new Error('You must provide a MongoDB Atlas connection string.');
}

mongoose.plugin(schema => schema.options.usePushEach = true);

// Mongoose's built in promise library is deprecated. Replace it with ES2015 Promise.
mongoose.Promise = global.Promise;

// Connects to the MongoDB Clusters
mongoose.connect(MONGODB_ATLAS_CONNECTION_STRING, { useNewUrlParser: true });

const connection = mongoose.connection;

// Logs a message on success or failure
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', console.log.bind(console, 'connection success!'));

// Configures Express to use sessions. This places an encrypted identifier
// on the user's cookie. When a user makes a request, this middleware examines
// the cookie and modifies the request object to indicate which user made the request.
// The cookie itself only contains the id of a session. More data about the session
// are stored inside of MongoDB.
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'I love Spotify',
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({
      mongooseConnection: connection,
      autoReconnect: true
    })
  })
);

// Passport is wired up to Express as a middleware. When a request comes in,
// Passport will examine the request's session as set by the above passportConfig,
// and assign the current user to the req.user object.
// See services/auth.js for more details.
app.use(passport.initialize());
app.use(passport.session());

// Instructs Express to pass on any request made to the '/graphql' route
// to the GraphQL instance.
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

// Webpack runs as a middleware. If any request comes in for the root route "/",
// Webpack will respond with the output of the webpack process that is an HTML file
// and a single bundle output of all of your client-side JavaScript.
app.use(middleware(compiler));

module.exports = app;
