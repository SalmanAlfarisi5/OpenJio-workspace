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
    </div>
  );
};

export default Activities;
