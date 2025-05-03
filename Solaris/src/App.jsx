import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Profile from './components/Profile';

function App() {
  return (
    <Router>
      <Profile />
    </Router>
  );
}

export default App;