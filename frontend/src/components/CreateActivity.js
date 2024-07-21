import React, { useState, useEffect } from "react";
import "../Style.css";
import { useNavigate, useLocation } from "react-router-dom";

const CreateActivity = () => {
  const location = useLocation();
  const activityToEdit = location.state?.activity || null;
  const [formData, setFormData] = useState({
    title: "",
    act_desc: "",
    act_date: "",
    act_time: "",
    location: "",
    num_people: 1,
  });

  useEffect(() => {
    if (activityToEdit) {
      setFormData({
        title: activityToEdit.title,
        act_desc: activityToEdit.act_desc,
        act_date: activityToEdit.act_date,
        act_time: activityToEdit.act_time,
        location: activityToEdit.location,
        num_people:
          activityToEdit.num_people > 0 ? activityToEdit.num_people : 1,
      });
    }
  }, [activityToEdit]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "num_people") {
      const numValue = Math.max(1, parseInt(value, 10) || 1); // Ensure value is at least 1
      setFormData({ ...formData, [name]: numValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
      const method = activityToEdit ? "PUT" : "POST";
      const url = activityToEdit
        ? `/api/activities/${activityToEdit.id}`
        : "/api/activities";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const activity = await response.json();
        console.log("Activity saved", activity);
        navigate("/activities");
      } else {
        const errorText = await response.text();
        console.error("Error saving activity:", errorText);
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
      <h1>{activityToEdit ? "Edit Activity" : "Create Activity"}</h1>
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
        <input
          type="number"
          name="num_people"
          placeholder="Number of People"
          value={formData.num_people}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {activityToEdit ? "Update Activity" : "Create Activity"}
        </button>
      </form>
    </div>
  );
};

export default CreateActivity;
