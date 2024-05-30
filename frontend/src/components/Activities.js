import React from "react";
import "./Activities.css";
import { useNavigate } from "react-router-dom";

const Activities = () => {
  const navigate = useNavigate();
  return (
    <div className="activities-container">
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
        <button className="button button-link">Learn More</button>
      </div>
      <div className="blocks">
        <div className="activity-block"></div>
        <div className="activity-block"></div>
        <div className="activity-block"></div>
      </div>
    </div>
  );
};

export default Activities;
