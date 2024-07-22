import React, { useEffect, useState, useCallback } from "react";
import "../Style.css";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [showMyActivities, setShowMyActivities] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [profilePhoto, setProfilePhoto] = useState("/Avatar.png");
  const [showRequests, setShowRequests] = useState(false);
  const [requests, setRequests] = useState([]);
  const [requestedActivities, setRequestedActivities] = useState([]);
  const [userLists, setUserLists] = useState({});
  const [visibleUserLists, setVisibleUserLists] = useState([]);
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("user_id");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

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

  const fetchJoinRequests = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("/api/join-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched join requests: ", data); // Log to inspect the fetched data
        setRequests(data);
      } else {
        const errorText = await response.text();
        console.error("Error fetching join requests:", errorText);
      }
    } catch (error) {
      console.error("Error fetching join requests:", error);
    }
  };

  const fetchPendingRequests = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `/api/user-pending-requests/${currentUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRequestedActivities(data.map((request) => request.activity_id));
      } else {
        const errorText = await response.text();
        console.error("Error fetching pending requests:", errorText);
      }
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  }, [currentUserId]);

  const fetchUserActivitySlots = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `/api/user-activity-slots/${currentUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const errorText = await response.text();
        console.error("Error fetching user activity slots:", errorText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user activity slots:", error);
      return null;
    }
  }, [currentUserId]);

  const fetchUsersForActivity = async (activityId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/activity-users/${activityId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserLists((prevUserLists) => ({
          ...prevUserLists,
          [activityId]: data,
        }));
      } else {
        const errorText = await response.text();
        console.error("Error fetching users:", errorText);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleRemoveUser = async (userId, activityId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/remove-user/${activityId}/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setUserLists((prevUserLists) => ({
          ...prevUserLists,
          [activityId]: prevUserLists[activityId].filter(
            (user) => user.id !== userId
          ),
        }));
        alert("User removed successfully");
      } else {
        const errorText = await response.text();
        console.error("Error removing user:", errorText);
      }
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  const renderUserList = (activityId) => {
    const users = userLists[activityId] || [];
    const numPeople =
      activities.find((act) => act.id === activityId)?.num_people || 0;
    const userItems = [];

    for (let i = 0; i < numPeople; i++) {
      const user = users[i];
      userItems.push(
        <div key={i} className="user-item">
          <img
            src={user ? user.profile_photo || "/Avatar.png" : "/Avatar.png"}
            alt={user ? user.username : "Empty"}
            className="user-image"
            onClick={() => handleProfileClick(user?.id)}
          />
          <span>{user ? user.username : "Empty"}</span>
          {user && (
            <button
              className="remove-button"
              onClick={() => handleRemoveUser(user.id, activityId)}
            >
              X
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="user-list-popup" key={activityId}>
        <h3 className="popup-header">Users Joined</h3>
        <button
          className="close-button"
          onClick={() => handleUserListClose(activityId)}
        >
          X
        </button>
        <div className="request-list-content">{userItems}</div>
      </div>
    );
  };

  const handleUserListClick = (activityId) => {
    if (!visibleUserLists.includes(activityId)) {
      setVisibleUserLists((prev) => [...prev, activityId]);
    }
    fetchUsersForActivity(activityId);
  };

  const handleUserListClose = (activityId) => {
    setVisibleUserLists((prev) => prev.filter((id) => id !== activityId));
  };

  useEffect(() => {
    const fetchActivitiesAndSlots = async () => {
      const url = showMyActivities ? "/api/my-activities" : "/api/activities";
      const token = localStorage.getItem("token");

      try {
        const [activitiesResponse, slotsResponse] = await Promise.all([
          fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetchUserActivitySlots(),
        ]);

        if (activitiesResponse.ok && slotsResponse) {
          const activitiesData = await activitiesResponse.json();
          const activitiesWithMapUrls = await Promise.all(
            activitiesData.map(async (activity) => {
              const hostResponse = await fetch(
                `/api/profile/${activity.user_id_host}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
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

          // Match activities with user activity slots
          const matchedActivities = activitiesWithMapUrls.map((activity) => {
            const isJoined = Object.values(slotsResponse).includes(activity.id);
            return {
              ...activity,
              isJoined,
              isFull: activity.num_people_joined >= activity.num_people,
            };
          });
          setActivities(matchedActivities);
        } else {
          const errorText = await activitiesResponse.text();
          console.error("Error fetching activities:", errorText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchActivitiesAndSlots();
    fetchProfilePhoto();
    fetchJoinRequests();
    fetchPendingRequests();
  }, [showMyActivities, fetchPendingRequests, fetchUserActivitySlots]);

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

  const handleRequestListClick = () => {
    setShowRequests((prev) => !prev);
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
      const userActivitySlotsResponse = await fetchUserActivitySlots();
      const userActivities = Object.values(userActivitySlotsResponse);

      if (userActivities.includes(activity.id)) {
        alert("You have already joined this activity.");
        return;
      }

      if (userActivities.filter((id) => id !== null).length >= 10) {
        alert("You have joined too many activities!");
        return;
      }

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

      // Add new join request to database
      const joinRequestResponse = await fetch("/api/join-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          activity_id: activity.id,
          requester_id: currentUserId,
        }),
      });

      if (!joinRequestResponse.ok) {
        const errorText = await joinRequestResponse.text();
        console.error("Error creating join request:", errorText);
        alert("Failed to send the request. Please try again.");
        return;
      }

      fetchPendingRequests();
      setRequestedActivities((prev) => [...prev, activity.id]);

      alert("Request to join activity sent successfully!");
    } catch (error) {
      console.error("Error sending email and creating join request:", error);
      alert("Failed to send the request. Please try again.");
    }
  };

  const handleAcceptRequest = async (requestId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/join-requests/${requestId}/accept`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchJoinRequests();
      } else {
        const errorText = await response.text();
        console.error("Error accepting join request:", errorText);
      }
    } catch (error) {
      console.error("Error accepting join request:", error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/join-requests/${requestId}/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchJoinRequests();
      } else {
        const errorText = await response.text();
        console.error("Error rejecting join request:", errorText);
      }
    } catch (error) {
      console.error("Error rejecting join request:", error);
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
    <div className="activities">
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
            onClick={handleRequestListClick}
          >
            Request List
          </button>
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
        {showRequests && (
          <div className="request-list">
            <h3>Requests</h3>
            <div className="request-list-content">
              {requests.length === 0 ? (
                <p className="no-requests">No requests at the moment</p>
              ) : (
                requests.map((request) => (
                  <div key={request.id} className="request-item">
                    <img
                      src={request.profile_photo || "/Avatar.png"}
                      alt={request.username}
                      className="requester-image"
                      onClick={() => handleProfileClick(request.requester_id)}
                    />
                    <span>
                      {request.username} would like to join your activity,{" "}
                      {request.activity_title}!
                    </span>
                    <button
                      className="accept-button"
                      onClick={() => handleAcceptRequest(request.id)}
                    >
                      Accept
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => handleRejectRequest(request.id)}
                    >
                      Reject
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        <div className="activities-list">
          {sortedActivities.map((activity) => (
            <div key={activity.id} className="activity-block">
              <img
                onClick={() =>
                  handleProfileClick(
                    activity.user_id_host === currentUserId
                      ? ""
                      : activity.user_id_host
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
                <br />
                <span>
                  People: {activity.num_people_joined} / {activity.num_people}
                </span>
              </p>
              {!showMyActivities && (
                <>
                  {String(activity.user_id_host) === currentUserId ? (
                    <button className="button joined-button" disabled>
                      Joined
                    </button>
                  ) : activity.isJoined ? (
                    <button className="button joined-button" disabled>
                      Joined
                    </button>
                  ) : activity.isFull ? (
                    <button className="button full-button" disabled>
                      Full
                    </button>
                  ) : requestedActivities.includes(activity.id) ? (
                    <button className="button requested-button" disabled>
                      Requested
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
                  <button
                    className="button users-button"
                    onClick={() => handleUserListClick(activity.id)}
                  >
                    Users
                  </button>
                </div>
              )}
              {visibleUserLists.includes(activity.id) &&
                renderUserList(activity.id)}
            </div>
          ))}
        </div>
        <button className="return-button" onClick={() => navigate("/home")}>
          Return
        </button>
      </div>
    </div>
  );
};

export default Activities;
