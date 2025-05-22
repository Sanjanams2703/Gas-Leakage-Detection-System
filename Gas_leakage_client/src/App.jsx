import React from 'react';
import Dashboard from './pages/DashBoard';
import './assets/styles.css';

const App = () => {
  return (
    <div className='app-container'>
      <h1 className='app-title'>Gas Leakage Detection System</h1>
      <Dashboard />
    </div>
  );
};

export default App;