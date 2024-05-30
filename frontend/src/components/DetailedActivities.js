import React from "react";
import "./DetailedActivities.css";
import { useNavigate } from "react-router-dom";

const DetailedActivities = () => {
  const navigate = useNavigate();
  return (
    <div className="DetailedActivities-container">
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
      <div className="block"></div>
    </div>
  );
};

export default DetailedActivities;
