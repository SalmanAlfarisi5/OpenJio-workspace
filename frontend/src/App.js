import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';

const Home = () => {
  const navigate = useNavigate();

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
        <button 
          className='button get-started-button' 
          onClick={() => navigate('/login')}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
