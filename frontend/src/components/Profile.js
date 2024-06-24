import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState({
    real_name: "",
    username: "",
    email: "", // Add email here
    social_media: "",
    dob: "",
    description: "",
    profile_photo: "", // Assuming you have profile photo field
  });

  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
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
          setImagePreview(response.data.profile_photo);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };
      fetchProfile();
    }
  }, [navigate]);

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
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
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
        <h3>Name: {profile.real_name}</h3>
        <h3>Username: {profile.username}</h3>
        <h3>Email: {profile.email}</h3> {/* Display email here */}
        <h3>Social Media:</h3>
        <input
          type="text"
          name="social_media"
          value={profile.social_media}
          onChange={handleChange}
        />
        <h3>Date of Birth:</h3>
        <input
          type="date"
          name="dob"
          value={profile.dob}
          onChange={handleChange}
        />
        <h3>Description:</h3>
        <textarea
          name="description"
          value={profile.description}
          onChange={handleChange}
          rows="4"
          cols="50"
          placeholder="Enter your description here..."
        />
        <button type="submit">Update Profile</button>
      </form>
      {message && <p>{message}</p>}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Profile;
