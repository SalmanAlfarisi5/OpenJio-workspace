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
      <div className="detailedblock">
        <div className="detailedactivity-block">
          <img
            src="/soccer.jpg"
            alt="soccer"
            className="detailedactivity-image"
          ></img>
          <div className="detailedblock-text">
            <div className="detailedactivity-title">Football Match</div>
            <p>
              Hi there, we would like to request someone and if possible around
              Buona Vista to join us on a football event. We apparently need 3
              more people so that we could attend it, specifically as a centre
              back, midfielder and a goalkeeper.
            </p>
            <h2>Requirement:</h2>
            <ul>
              <li>Have experiences in playing football</li>
              <li>Ranging age of 20-23 years old</li>
            </ul>
            <br></br>
            <h2>Host</h2>
            <div className="host-detailed">
              <img src="./salman.jpg" className="host-image" alt="salman"></img>
              <p>Muhammad Salman Al Farisi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedActivities;
