// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState({
    real_name: '',
    username: '',
    social_media: '',
    dob: '',
    description: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      const fetchProfile = async () => {
        try {
          const response = await axios.get('http://localhost:8080/api/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProfile(response.data);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      };
      fetchProfile();
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:8080/api/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h1>Profile Page</h1>
      <h3>Name: {profile.real_name}</h3>
      <h3>Username: {profile.username}</h3>
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
      <button onClick={handleSubmit}>Update Profile</button>
      {message && <p>{message}</p>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
