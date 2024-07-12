import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
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
import Host from "./components/Host";
import Forum from "./components/Forum"; // Import the new Forum component

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
        <button className="button" onClick={() => navigate("/forum")}>
          Forum
        </button>
      </div>
      <div className="hero-content">
        <p className="hero-text">
          Connecting Communities One Activity at a Time - Create, Join, and
          Enjoy.
        </p>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/learnmore" element={<LearnMore />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/createactivity" element={<CreateActivity />} />
        <Route path="/host" element={<Host />} />
      </Routes>
    </Router>
  );
};

export default App;
