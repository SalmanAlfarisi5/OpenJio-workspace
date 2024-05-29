import React from 'react';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <img src="/logo.png" alt="Logo" className="logo" />
      <div className="nav-container">
        <button className="button button-link">Leaderboard</button>
        <button className="button button-link">Activities</button>
        <button className="button button-link">Learn More</button>
      </div>
      <div className="hero-content">
        <p className='hero-text'>Connecting Communities One Activity at a Time - Create, Join, and Enjoy.</p>
        <button className='button get-started-button'>Get Started</button>
      </div>
    </div>
  );
};

export default App;


