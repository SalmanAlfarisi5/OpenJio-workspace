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
        <button
          className="button button-link"
          onClick={() => navigate("/LearnMore")}
        >
          Learn More
        </button>
      </div>
      <div className="blocks">
        <div className="activity-block">
          <img alt="soccer" className="activity-image" src="/soccer.jpg"></img>
          <h2 className="activity-tittle">Soccer Match</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            ultricies augue eu dolor facilisis, sit amet finibus est fermentum.
            In hac habitasse platea dictumst. In cursus orci ac nunc tincidunt,
            sit amet auctor velit mollis. Praesent pharetra sit amet nisi eget
            aliquet. Nam vel lectus venenatis, aliquet lorem vitae, aliquam
            quam.
          </p>
          <div class="button-container">
            <button
              class="join-button"
              onClick={() => navigate("/DetailedActivities")}
            >
              Join
            </button>
          </div>
        </div>
        <div className="activity-block">
          <img
            alt="watching a movie"
            className="activity-image"
            src="/movies.jpg"
          ></img>
          <h2 className="activity-tittle">Watching a Movie</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            ultricies augue eu dolor facilisis, sit amet finibus est fermentum.
            In hac habitasse platea dictumst. In cursus orci ac nunc tincidunt,
            sit amet auctor velit mollis. Praesent pharetra sit amet nisi eget
            aliquet. Nam vel lectus venenatis, aliquet lorem vitae, aliquam
            quam.
          </p>
          <div class="button-container">
            <button
              class="join-button"
              onClick={() => navigate("/DetailedActivities")}
            >
              Join
            </button>
          </div>
        </div>
        <div className="activity-block">
          <img
            alt="House Party"
            className="activity-image"
            src="./house-party.jpg"
          ></img>
          <h2 className="activity-tittle">House Party</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            ultricies augue eu dolor facilisis, sit amet finibus est fermentum.
            In hac habitasse platea dictumst. In cursus orci ac nunc tincidunt,
            sit amet auctor velit mollis. Praesent pharetra sit amet nisi eget
            aliquet. Nam vel lectus venenatis, aliquet lorem vitae, aliquam
            quam.
          </p>
          <div class="button-container">
            <button
              class="join-button"
              onClick={() => navigate("/DetailedActivities")}
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activities;
