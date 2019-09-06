import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import SignupForm from './SignupForm';
import SigninForm from './SigninForm';
import Portfolio from './Portfolio';
import Transactions from './Transactions';
import requireAuth from './requireAuth';

const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/account/new" component={SignupForm} />
      <Route path="/account/existing" component={SigninForm} />
      <Route path="/account/portfolio" component={requireAuth(Portfolio)} />
      <Route path="/account/transactions" component={requireAuth(Transactions)} />
    </Switch>
  );
};

export default Routes;
