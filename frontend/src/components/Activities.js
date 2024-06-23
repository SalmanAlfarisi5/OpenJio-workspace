import React, { useEffect, useState } from "react";
import "./Activities.css";
import { useNavigate } from "react-router-dom";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [showMyActivities, setShowMyActivities] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      const url = showMyActivities ? "/api/my-activities" : "/api/activities";
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          // Create a Google Maps URL for each activity
          const activitiesWithMapUrls = data.map((activity) => ({
            ...activity,
            mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              activity.location
            )}`,
          }));
          setActivities(activitiesWithMapUrls);
        } else {
          const errorText = await response.text();
          console.error("Error fetching activities:", errorText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchActivities();
  }, [showMyActivities]);

  const handleProfileClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const handleCreateActivityClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/CreateActivity");
    } else {
      console.error("No token found, please login first");
      navigate("/login");
    }
  };

  const handleMyActivitiesClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setShowMyActivities((prev) => !prev);
    } else {
      console.error("No token found, please login first");
      navigate("/login");
    }
  };

  const handleDeleteClick = async (activityId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/activities/${activityId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setActivities((prevActivities) =>
          prevActivities.filter((activity) => activity.id !== activityId)
        );
        console.log("Activity deleted successfully");
      } else {
        const errorText = await response.text();
        console.error("Error deleting activity:", errorText);
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  const handleJoinClick = (activityId) => {
    alert(`Sending request to join activity ID: ${activityId}`);
    // Implement the join functionality here
  };

  return (
    <div className="activities-container">
      <img
        src="/Avatar.png"
        alt="Profile"
        className="Profile"
        onClick={handleProfileClick}
      />
      <div className="top-button">
        <button
          className="button button-link"
          onClick={handleMyActivitiesClick}
        >
          {showMyActivities ? "All Activities" : "My Activities"}
        </button>
        <button
          className="button button-link"
          onClick={handleCreateActivityClick}
        >
          Create an Activity
        </button>
      </div>
      <div className="activities-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-block">
            <img
              onClick={() => navigate(`/host/${activity.user_id_host}`)}
              src={activity.avatar || "/Avatar.png"}
              alt={activity.title}
              className="activity-image"
            />
            <h3 className="activity-title">{activity.title}</h3>
            <p className="activity-description">{activity.act_desc}</p>
            <p className="activity-date-time">
              <span>Date: {activity.act_date}</span>
              <br />
              <span>Time: {activity.act_time}</span>
              <br />
              <span>
                Location:{" "}
                <a
                  href={activity.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {activity.location}
                </a>
              </span>
            </p>
            <div className="button-container">
              {showMyActivities ? (
                <button
                  className="delete-button"
                  onClick={() => handleDeleteClick(activity.id)}
                >
                  Delete
                </button>
              ) : (
                <button
                  className="join-button"
                  onClick={() => handleJoinClick(activity.id)}
                >
                  Join
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activities;
