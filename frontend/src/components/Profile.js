import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../Style.css";

const Profile = () => {
  const [profile, setProfile] = useState({
    real_name: "",
    username: "",
    email: "",
    social_media: "",
    dob: "",
    description: "",
    profile_photo: "",
  });

  const [initialProfile, setInitialProfile] = useState({});
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();
  const currentUserId = localStorage.getItem("user_id");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      const fetchProfile = async () => {
        try {
          const response = await axios.get(
            `/api/profile${userId ? `/${userId}` : ""}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setProfile(response.data);
          setInitialProfile(response.data);
          setImagePreview(response.data.profile_photo);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };
      fetchProfile();
    }
  }, [navigate, userId]);

  const enterEditMode = () => {
    setIsEditMode(true);
  };

  const cancelEditMode = () => {
    setIsEditMode(false);
    setProfile(initialProfile);
    setImagePreview(initialProfile.profile_photo);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile_photo", file);

      const token = localStorage.getItem("token");

      try {
        const response = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        setImagePreview(response.data.profile_photo);
        setProfile({ ...profile, profile_photo: response.data.profile_photo });
        setMessage(response.data.message);

        setTimeout(() => {
          setMessage("");
        }, 5000);
      } catch (error) {
        console.error("Error uploading profile photo:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put("/api/profile", profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message);
      setIsEditMode(false);

      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleChatClick = () => {
    navigate("/chat", { state: { targetUserId: userId } });
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>Profile Page</h1>
        <form onSubmit={handleSubmit}>
          <div className="profile-photo-container">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="profile-photo"
              />
            ) : (
              <div className="profile-photo-placeholder">No Image</div>
            )}
            {(!userId || userId === currentUserId) && (
              <>
                <label htmlFor="fileInput" className="file-input-label">
                  Choose File
                </label>
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </>
            )}
          </div>
          {isEditMode ? (
            <>
              <div className="profile-field">
                <h3>Name:</h3>
                <input
                  type="text"
                  name="real_name"
                  value={profile.real_name}
                  onChange={handleChange}
                />
              </div>
              <div className="profile-field">
                <h3>Social Media:</h3>
                <input
                  type="text"
                  name="social_media"
                  value={profile.social_media}
                  onChange={handleChange}
                />
              </div>
              <div className="profile-field">
                <h3>Date of Birth:</h3>
                <input
                  type="date"
                  name="dob"
                  value={profile.dob}
                  onChange={handleChange}
                />
              </div>
              <div className="profile-field">
                <h3>Description:</h3>
                <textarea
                  name="description"
                  value={profile.description}
                  onChange={handleChange}
                  rows="4"
                  cols="50"
                  placeholder="Enter your description here..."
                />
              </div>
              <button type="submit">Update Profile</button>
              <button type="button" onClick={cancelEditMode}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <div className="profile-field">
                <h3>Name:</h3>
                <p>{profile.real_name}</p>
              </div>
              <div className="profile-field">
                <h3>Username:</h3>
                <p>{profile.username}</p>
              </div>
              <div className="profile-field">
                <h3>Email:</h3>
                <p>{profile.email}</p>
              </div>
              <div className="profile-field">
                <h3>Social Media:</h3>
                <p>{profile.social_media}</p>
              </div>
              <div className="profile-field">
                <h3>Date of Birth:</h3>
                <p>{formatDate(profile.dob)}</p>
              </div>
              <div className="profile-field">
                <h3>Description:</h3>
                <p>{profile.description}</p>
              </div>
              {(!userId || userId === currentUserId) && (
                <button onClick={enterEditMode}>Edit</button>
              )}
            </>
          )}
        </form>
        {message && <p>{message}</p>}
        {(!userId || userId === currentUserId) && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
        {userId && userId !== currentUserId && (
          <button onClick={handleChatClick} className="chat-button">
            Chat
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
