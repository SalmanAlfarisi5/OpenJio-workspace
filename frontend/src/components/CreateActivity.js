import React, { useState } from "react";
import "./CreateActivity.css";
import { useNavigate } from "react-router-dom";

const CreateActivity = () => {
  const [formData, setFormData] = useState({
    title: "",
    act_desc: "", // Update to match backend field
    location: "",
    act_date: "", // Ensure naming consistency
    act_time: "", // Ensure naming consistency
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, please login first");
      navigate("/login");
      return;
    }
    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const activity = await response.json();
        console.log("Activity Created", activity);
        navigate("/activities");
      } else {
        const errorText = await response.text();
        console.error("Error creating activity:", errorText); // Log detailed error
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="create-activity">
      <h1>Create Activity</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="act_desc" // Update to match backend field
          placeholder="Description"
          value={formData.act_desc}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="act_date" // Ensure naming consistency
          value={formData.act_date}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="act_time" // Ensure naming consistency
          value={formData.act_time}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <button type="submit">Create Activity</button>
      </form>
    </div>
  );
};

export default CreateActivity;
