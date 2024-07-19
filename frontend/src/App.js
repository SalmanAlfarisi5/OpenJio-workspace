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
import Activities from "./components/Activities";
import LearnMore from "./components/LearnMore";
import Profile from "./components/Profile";
import CreateActivity from "./components/CreateActivity";
import Forum from "./components/Forum";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="App">
      <img src="/logo.png" alt="Logo" className="logo" />
      <div className="top-button">
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
        <Route path="/activities" element={<Activities />} />
        <Route path="/learnmore" element={<LearnMore />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/createactivity" element={<CreateActivity />} />
      </Routes>
    </Router>
  );
};

export default App;
