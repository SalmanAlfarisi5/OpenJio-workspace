import React from "react";

const Host = () => {
  const profile = {
    real_name: "John Doe",
    username: "johndoe123",
    email: "john.doe@example.com",
    social_media: "https://twitter.com/johndoe",
    dob: "1990-01-01",
    description: "This is a short description about John Doe.",
    profile_photo: "https://via.placeholder.com/150", // Placeholder image URL
  };

  return (
    <div className="host-container">
      <h1>User Information</h1>
      <div className="profile-info">
        <div className="profile-photo-container">
          {profile.profile_photo ? (
            <img
              src={profile.profile_photo}
              alt="Profile"
              className="profile-photo"
            />
          ) : (
            <div className="profile-photo-placeholder">No Image</div>
          )}
        </div>
        <h3>Name: {profile.real_name}</h3>
        <h3>Username: {profile.username}</h3>
        <h3>Email: {profile.email}</h3>
        <h3>Date of Birth: {profile.dob}</h3>
        <h3>Social Media:</h3>
        <a
          href={profile.social_media}
          target="_blank"
          rel="noopener noreferrer"
        >
          {profile.social_media}
        </a>
        <h3>Description:</h3>
        <p>{profile.description}</p>
      </div>
    </div>
  );
};

export default Host;
