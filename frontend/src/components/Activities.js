// src/components/Activities.js
import React from "react";
import "./Activities.css";
import { useNavigate } from "react-router-dom";

const Activities = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="activities-container">
      <img
        src="/Avatar.png"
        alt="Profile"
        className="Profile"
        onClick={handleProfileClick}
        style={{ cursor: "pointer" }}
      />
      <div className="top-button">
        <button
          className="button button-link"
          onClick={() => navigate("/CreateActivity")}
        >
          Create an Activity
        </button>
      </div>
      <div className="blocks">
        <div className="activity-block">
          <img alt="soccer" className="activity-image" src="/soccer.jpg"></img>
          <h2 className="activity-title">Soccer Match</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            ultricies augue eu dolor facilisis, sit amet finibus est fermentum.
            In hac habitasse platea dictumst. In cursus orci ac nunc tincidunt,
            sit amet auctor velit mollis. Praesent pharetra sit amet nisi eget
            aliquet. Nam vel lectus venenatis, aliquet lorem vitae, aliquam
            quam.
          </p>
          <div className="button-container">
            <button
              className="join-button"
              onClick={() => navigate("/detailedactivities")}
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
          <h2 className="activity-title">Watching a Movie</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            ultricies augue eu dolor facilisis, sit amet finibus est fermentum.
            In hac habitasse platea dictumst. In cursus orci ac nunc tincidunt,
            sit amet auctor velit mollis. Praesent pharetra sit amet nisi eget
            aliquet. Nam vel lectus venenatis, aliquet lorem vitae, aliquam
            quam.
          </p>
          <div className="button-container">
            <button
              className="join-button"
              onClick={() => navigate("/detailedactivities")}
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
          <h2 className="activity-title">House Party</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            ultricies augue eu dolor facilisis, sit amet finibus est fermentum.
            In hac habitasse platea dictumst. In cursus orci ac nunc tincidunt,
            sit amet auctor velit mollis. Praesent pharetra sit amet nisi eget
            aliquet. Nam vel lectus venenatis, aliquet lorem vitae, aliquam
            quam.
          </p>
          <div className="button-container">
            <button
              className="join-button"
              onClick={() => navigate("/detailedactivities")}
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
