import React from 'react';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <img src="/logo.png" alt="Logo" className="logo" />
      <div className="buttons-container">
        <button className="button button-link">Leaderboard</button>
        <button className="button button-link">Activities</button>
        <button className="button button-link">Learn More</button>
      </div>
      <p className='text'>Connecting Communities One Activity at a Time - Create, Join, and Enjoy.</p>
    </div>
  );
};

export default App;