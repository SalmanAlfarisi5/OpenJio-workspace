import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./Style.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Activities from "./components/Activities";
import Profile from "./components/Profile";
import CreateActivity from "./components/CreateActivity";
import Forum from "./components/Forum";
import Chat from "./components/Chat";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword"; 

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="App">
      <video autoPlay loop muted className="background-video">
        <source src="/home_background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="header">
        <img src="/logo.png" alt="Logo" className="logo" />
        <div className="top-button">
          <button className="button" onClick={() => navigate("/activities")}>
            Activities
          </button>
          <button className="button" onClick={() => navigate("/forum")}>
            Forum
          </button>
          <button className="button" onClick={() => navigate("/chat")}>
            Chat
          </button>
        </div>
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
        <Route path="/forum" element={<Forum />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/createactivity" element={<CreateActivity />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} /> 
      </Routes>
    </Router>
  );
};

export default App;
