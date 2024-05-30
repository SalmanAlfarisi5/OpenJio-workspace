import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Leaderboard from './components/Leaderboard'; // Import the Leaderboard component

const Home = () => {
  const navigate = useNavigate(); // Hook to get the navigate function

  return (
    <div className="App">
      <img src="/logo.png" alt="Logo" className="logo" />
      <div className="top-button">
        <button className="button button-link" onClick={() => navigate('/leaderboard')}>Leaderboard</button> {/* Update the Leaderboard button */}
        <button className="button button-link">Activities</button>
        <button className="button button-link">Learn More</button>
      </div>
      <div className="hero-content">
        <p className='hero-text'>Connecting Communities One Activity at a Time - Create, Join, and Enjoy.</p>
        <button
          className='button get-started-button'
          onClick={() => navigate('/login')} // Use navigate to go to the login page
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
        <Route path="/register" element={<Register />} />
        <Route path="/leaderboard" element={<Leaderboard />} /> {/* Add the leaderboard route */}
      </Routes>
    </Router>
  );
};

export default App;
