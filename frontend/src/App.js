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
import Profile from "./components/Profile";
import CreateActivity from "./components/CreateActivity";
import ProtectedRoute from "./components/ProtectedRoute";

import Host from "./components/Host";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="App">
      <img src="/logo.png" alt="Logo" className="logo" />
      <div className="top-button">
        <button className="button" onClick={() => navigate("/leaderboard")}>
          Leaderboard
        </button>
        <button className="button" onClick={() => navigate("/activities")}>
          Activities
        </button>
        <button className="button" onClick={() => navigate("/learnmore")}>
          Learn More
        </button>
      </div>
      <div className="hero-content">
        <p className="hero-text">
          Connecting Communities One Activity at a Time - Create, Join, and
          Enjoy.
        </p>
        <button className="button" onClick={() => navigate("/login")}>
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

        <Route path="/host" element={<Host />} />
      </Routes>
    </Router>
  );
};

export default App;
