import React from 'react';
import './App.css';
import { Router, Route } from 'react-router-dom';
import history from './history';

import Host from 'Containers/Host/provider'
import Player from 'Containers/Participant/provider'

function App() {
  return (
        <Router history={history}>
            <Route path="/host" component={Host} />
            <Route path="/player" component={Player} />
        </Router>
    
  );
}

export default App;
