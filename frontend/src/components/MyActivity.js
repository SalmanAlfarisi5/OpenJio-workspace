import React from "react";
import "./Activities.css";
import { useNavigate } from "react-router-dom";

const activities = [
  {
    id: 1,
    avatar: "/Avatar.png",
    name: "Beach Volleyball",
    description:
      "Join us for a fun game of beach volleyball. All skill levels are welcome!",
    date: "21/06/2024",
    time: "14:00",
    location: "marina bay",
  },
  {
    id: 2,
    avatar: "/Avatar.png",
    name: "Sandcastle Building",
    description:
      "Compete to build the best sandcastle. Bring your creativity and tools!",
    date: "22/06/2024",
    time: "10:00",
    location: "pgpr",
  },
  {
    id: 3,
    avatar: "/Avatar.png",
    name: "Treasure Hunt",
    description:
      "Participate in a thrilling treasure hunt along the beach. Find the clues and win the prize!",
    date: "23/06/2024",
    time: "12:00",
    location: "my house",
  },
];

const MyActivity = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile");
    } else {
      navigate("/profile");
    }
  };

  const handleJoinClick = (activityId) => {
    alert(`Sending request with ID: ${activityId}`);
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
            <p className="activity-date-time">
              <span>Date: {activity.date}</span>
              <br></br>
              <span>Time: {activity.time}</span>
              <br></br>
              <span>Location: {activity.location}</span>
            </p>
            <div className="button-container">
              <button
                className="join-button"
                onClick={() => handleJoinClick(activity.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyActivity;
