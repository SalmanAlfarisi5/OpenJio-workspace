import React, { useEffect, useState } from "react";
import "./Activities.css";
import { useNavigate } from "react-router-dom";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  // Fetch activities from the backend
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("/api/activities");
        if (response.ok) {
          const data = await response.json();
          setActivities(data);
        } else {
          console.error("Error fetching activities");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchActivities();
  }, []);

  const handleProfileClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const handleJoinClick = (activityId) => {
    alert(`Sending request to join activity with ID: ${activityId}`);
    // Implement the join functionality here, e.g., send a request to the backend
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
          onClick={() => navigate("/MyActivity")}
        >
          My Activities
        </button>
        <button
          className="button button-link"
          onClick={() => navigate("/CreateActivity")}
        >
          Create an Activity
        </button>
      </div>
      <div className="activities-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-block">
            <img
              onClick={() => navigate("/host/${activity.user_id_host}")}
              src={activity.avatar || "/Avatar.png"} // Default avatar if not provided
              alt={activity.name}
              className="activity-image"
            />
            <h3 className="activity-title">{activity.title}</h3>
            <p className="activity-description">{activity.act_des}</p>
            <p className="activity-date-time">
              <span>Date: {activity.act_date}</span>
              <br />
              <span>Time: {activity.act_time}</span>
              <br />
              <span>Location: {activity.location}</span>
            </p>
            <div className="button-container">
              <button
                className="join-button"
                onClick={() => handleJoinClick(activity.id)}
              >
                Join
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activities;
