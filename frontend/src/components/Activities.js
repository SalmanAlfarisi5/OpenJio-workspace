import React from "react";
import "./Activities.css";
import { useNavigate } from "react-router-dom";

// Example activities data
const activities = [
  {
    id: 1,
    avatar: "/Avatar.png",
    name: "Beach Volleyball",
    description:
      "Join us for a fun game of beach volleyball. All skill levels are welcome!",
  },
  {
    id: 2,
    avatar: "/Avatar.png",
    name: "Sandcastle Building",
    description:
      "Compete to build the best sandcastle. Bring your creativity and tools!",
  },
  {
    id: 3,
    avatar: "/Avatar.png",
    name: "Treasure Hunt",
    description:
      "Participate in a thrilling treasure hunt along the beach. Find the clues and win the prize!",
  },
  // Add more activities as needed
];

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

  const handleJoinClick = (activityId) => {
    // Logic for joining an activity
    alert(`Joined activity with ID: ${activityId}`);
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
      <div className="activities-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-block">
            <img
              src={activity.avatar}
              alt={activity.name}
              className="activity-image"
            />
            <h3 className="activity-title">{activity.name}</h3>
            <p className="activity-description">{activity.description}</p>
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
