import React, { useEffect, useState } from "react";
import "./Activities.css";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [showMyActivities, setShowMyActivities] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [profilePhoto, setProfilePhoto] = useState("/Avatar.png");
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("user_id");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

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
          const activitiesWithMapUrls = await Promise.all(
            data.map(async (activity) => {
              const hostResponse = await fetch(`/api/profile/${activity.user_id_host}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              });
              const hostData = await hostResponse.json();
              return {
                ...activity,
                profile_photo: hostData.profile_photo || "/Avatar.png",
                mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  activity.location
                )}`,
              };
            })
          );
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
    fetchProfilePhoto();
  }, [showMyActivities]);

  const fetchProfilePhoto = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProfilePhoto(data.profile_photo || "/Avatar.png");
        } else {
          const errorText = await response.text();
          console.error("Error fetching profile photo:", errorText);
        }
      } catch (error) {
        console.error("Error fetching profile photo:", error);
      }
    }
  };

  const handleProfileClick = (userId) => {
    const token = localStorage.getItem("token");
    if (token) {
      if (userId === currentUserId) {
        navigate("/profile");
      } else {
        navigate(`/profile/${userId}`);
      }
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

  const handleJoinClick = async (activity) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("User not authenticated. Redirecting to login page.");
      navigate("/login");
      return;
    }

    try {
      const hostResponse = await fetch(`/api/activity-host/${activity.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!hostResponse.ok) {
        console.error("Error fetching host information");
        alert("Failed to fetch host information. Please try again later.");
        return;
      }

      const hostData = await hostResponse.json();
      const { host_username, host_email } = hostData;

      const userResponse = await fetch(`/api/user-details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        console.error("Error fetching user information");
        alert("Failed to fetch user information. Please try again later.");
        return;
      }

      const userData = await userResponse.json();
      const { username: requester_username, email: requester_email } = userData;

      const templateParams = {
        to_name: host_username,
        from_name: "OpenJio Support",
        message: `${requester_username} (${requester_email}) is interested in joining the activity: ${activity.title}`,
        user_email: host_email,
      };

      await emailjs.send(
        "service_jfmlggb",
        "template_fx34iqr",
        templateParams,
        "h1VRX5prAELaGTTuh"
      );

      alert("Request to join activity sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send the request. Please try again.");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleEditClick = (activity) => {
    navigate("/CreateActivity", { state: { activity } });
  };

  const filteredActivities = activities.filter((activity) =>
    activity.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedActivities = [...filteredActivities].sort((a, b) => {
    const dateA = new Date(a.act_date);
    const dateB = new Date(b.act_date);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="activities-container">
      <img
        src={profilePhoto}
        alt="Profile"
        className="Profile"
        onClick={() => handleProfileClick(currentUserId)}
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
      <div className="search-sort-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="sort-order">
          <label htmlFor="sortOrder">Sort by date: </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={handleSortOrderChange}
          >
            <option value="asc">Earliest to Latest</option>
            <option value="desc">Latest to Earliest</option>
          </select>
        </div>
      </div>
      <div className="activities-list">
        {sortedActivities.map((activity) => (
          <div key={activity.id} className="activity-block">
            <img
              onClick={() =>
                handleProfileClick(
                  activity.user_id_host === currentUserId ? "" : activity.user_id_host
                )
              }
              src={activity.profile_photo || "/Avatar.png"}
              alt={activity.title}
              className="activity-image"
            />
            <h3 className="activity-title">{activity.title}</h3>
            <p className="activity-description">{activity.act_desc}</p>
            <p className="activity-date-time">
              <span>Date: {formatDate(activity.act_date)}</span>
              <br />
              <span>Time: {activity.act_time}</span>
              <br />
              <span>
                Location:{" "}
                <a
                  href={activity.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="maps-link"
                >
                  {activity.location}
                </a>
              </span>
            </p>
            {!showMyActivities && (
              <>
                {String(activity.user_id_host) === currentUserId ? (
                  <button className="button joined-button" disabled>
                    Joined
                  </button>
                ) : (
                  <button
                    className="button join-button"
                    onClick={() => handleJoinClick(activity)}
                  >
                    Join
                  </button>
                )}
              </>
            )}
            {showMyActivities && (
              <div className="button-container">
                <button
                  className="button delete-button"
                  onClick={() => handleDeleteClick(activity.id)}
                >
                  Delete
                </button>
                <button
                  className="button edit-button"
                  onClick={() => handleEditClick(activity)}
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activities;
