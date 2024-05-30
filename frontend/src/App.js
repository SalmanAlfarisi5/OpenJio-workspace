import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Leaderboard from "./components/Leaderboard";
import Activities from "./components/Activities";
import LearnMore from "./components/LearnMore";
import DetailedActivities from "./components/DetailedActivities";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="App">
      <img src="/logo.png" alt="Logo" className="logo" />
      <div className="top-button">
        <button
          className="button button-link"
          onClick={() => navigate("/leaderboard")}
        >
          Leaderboard
        </button>
        <button
          className="button button-link"
          onClick={() => navigate("/Activities")}
        >
          Activities
        </button>
        <button
          className="button button-link"
          onClick={() => navigate("/LearnMore")}
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
          onClick={() => navigate("/login")} // Use navigate to go to the login page
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
        <Route path="/Activities" element={<Activities />} />
        <Route path="/LearnMore" element={<LearnMore />} />
        <Route path="/DetailedActivities" element={<DetailedActivities />} />
      </Routes>
    </Router>
  );
};

export default App;
