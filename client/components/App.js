import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Navbar from './Navbar';
import Routes from './Routes';

const App = () => {
  return (
    <div className="container">
      <Router>
        <div className="row">
          <div className="col s12">
            <Navbar />
            <Routes />
          </div>
        </div>
      </Router>
    </div>
  );
};

export default App;
