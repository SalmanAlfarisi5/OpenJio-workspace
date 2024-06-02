// src/components/Profile.js
import React, { useState } from "react";

const Profile = () => {
  const [dob, setDob] = useState("");
  const [description, setDescription] = useState("");

  const handleDobChange = (event) => {
    setDob(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = () => {
    console.log("Date of birth:", dob);
    console.log("Description:", description);
  };

  return (
    <div>
      <h1>Profile Page</h1>
      <h3>name: </h3>
      <h3>username:</h3>
      <h3>Social Media:</h3>
      <input type="text"></input>
      <h3>Date of birth:</h3>
      <input type="date" value={dob} onChange={handleDobChange} />
      <h3>Description:</h3>
      <textarea
        value={description}
        onChange={handleDescriptionChange}
        rows="4"
        cols="50"
        placeholder="Enter your description here..."
      />
      <br />
      <button onClick={handleSubmit}>Post</button>
    </div>
  );
};

export default Profile;
