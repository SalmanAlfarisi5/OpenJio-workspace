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
        <div className="activity-block">
          <img alt="soccer" className="activity-image" src="/soccer.jpg"></img>
          <h2 className="activity-title">Soccer Match</h2>
        </div>
        <div className="activity-block">
          <img
            alt="watching a movie"
            className="activity-image"
            src="/movies.jpg"
          ></img>
          <h2 className="activity-title">Watching a Movie</h2>
        </div>
        <div className="activity-block">
          <img
            alt="House Party"
            className="activity-image"
            src="./house-party.jpg"
          ></img>
          <h2 className="activity-title">House Party</h2>
        </div>
      </div>
    </div>
  );
};

export default Activities;
