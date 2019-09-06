# Stock

*NYC Tech Talent Pipeline Stage Two:* A stock portfolio application on the web to buy shares of a stock, and view all the transactions and owned stocks. It's created by React, GraphQL, Express, Passport and MongoDB.

## User Stories
1. A user can create a new account with their name, email, and password to buy stocks.
2. A user can authenticate via email and password to access their account.
3. A user can buy shares of a stock at its current price by specifying the ticker symbol and number of shares.
4. A user can view a list of all the transactions (trades) to date to perform an audit.
5. A user can view a list of all the stocks along with their current values (latest price times number of shares) to review performance.
6. A user can see the font color of stock symbols and current values change dynamically to indicate performance. (red = weak, grey = normal, green = strong)

## Get Started
1. Fork and clone this repository to your local computer using `git clone https://github.com/Your-Username/TTP-FS.git`
2. Move into the root directory: `cd TTP-FS`
3. Install all packages: `npm install`
4. Create a `keys.js` file in the root directory
5. Follow along [Getting Started with MongoDB Atlas](https://docs.atlas.mongodb.com/getting-started/) to create your Atlas cluster
6. Follow along [Connect via Driver](https://docs.atlas.mongodb.com/driver-connection/) to get the connection string for your Atlas cluster
7. Add `process.env.MONGODB_ATLAS_CONNECTION_STRING = 'your MongoDB Atlas connection string';` to the file
8. Start the local development server: `npm run start-dev`
9. See the application running at `http://localhost:3000/`

## Deployed Application

See the deployed application at https://buy-stock.herokuapp.com/
