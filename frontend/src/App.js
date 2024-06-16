import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Leaderboard from "./components/Leaderboard";
import Activities from "./components/Activities";
import LearnMore from "./components/LearnMore";
import Profile from "./components/Profile";
import CreateActivity from "./components/CreateActivity";
import ProtectedRoute from "./components/ProtectedRoute";

const Home = () => {
  return (
    <div className="App">
      <img src="/logo.png" alt="Logo" className="logo" />
      <div className="top-button">
        <button
          className="button button-link"
          onClick={() => (window.location.href = "/leaderboard")}
        >
          Leaderboard
        </button>
        <button
          className="button button-link"
          onClick={() => (window.location.href = "/activities")}
        >
          Activities
        </button>
        <button
          className="button button-link"
          onClick={() => (window.location.href = "/learnmore")}
        >
          Learn More
        </button>
      </div>
      <div className="hero-content">
        <p className="hero-text">
          Connecting Communities One Activity at a Time - Create, Join, and
          Enjoy.
        </p>
        <button
          className="button get-started-button"
          onClick={() => (window.location.href = "/login")}
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
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/learnmore" element={<LearnMore />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/createactivity" element={<CreateActivity />} />
      </Routes>
    </Router>
  );
};

export default App;
