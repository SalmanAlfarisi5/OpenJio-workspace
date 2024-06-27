import React, { useState } from "react";
import "./CreateActivity.css";
import { useNavigate } from "react-router-dom";

const CreateActivity = () => {
  const [formData, setFormData] = useState({
    title: "",
    act_desc: "",
    act_date: "",
    act_time: "",
    location: "",
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
        console.error("Error creating activity:", errorText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
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
          name="act_desc"
          placeholder="Description"
          value={formData.act_desc}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="act_date"
          value={formData.act_date}
          min={getCurrentDate()}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="act_time"
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
