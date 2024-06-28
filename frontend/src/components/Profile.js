import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      const fetchProfile = async () => {
        try {
          const response = await axios.get("/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProfile(response.data);
          setInitialProfile(response.data); // Store initial profile for cancel operation
          setImagePreview(response.data.profile_photo);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };
      fetchProfile();
    }
  }, [navigate]);

  const enterEditMode = () => {
    setIsEditMode(true);
  };

  const cancelEditMode = () => {
    setIsEditMode(false);
    setProfile(initialProfile); // Reset profile to initial values
    setImagePreview(initialProfile.profile_photo);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProfile({
          ...profile,
          profile_photo: reader.result,
        });
      };
      reader.readAsDataURL(file);
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
      setIsEditMode(false); // Exit edit mode after successful update

      // Clear the message after 5 seconds
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
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="container">
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
          <input type="file" accept="image/*" onChange={handleFileChange} />
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
            <button onClick={enterEditMode}>Edit</button>
          </>
        )}
      </form>
      {message && <p>{message}</p>}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Profile;
