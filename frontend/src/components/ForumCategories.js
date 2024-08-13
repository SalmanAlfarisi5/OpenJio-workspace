import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Style.css";

const ForumCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState("Forum");
  const navigate = useNavigate();

  const handleCategoryClick = (category, displayName) => {
    setSelectedCategory(displayName);
    navigate(`/forum/${category}`, { state: { displayName } });
  };

  return (
    <div className="ForumCategories">
      <h1>{selectedCategory}</h1> {/* Display the selected category */}
      <div className="BlockCategories">
        <div
          className="Categories"
          onClick={() => handleCategoryClick("general", "General")}
        >
          <h3>General</h3>
        </div>
        <div
          className="Categories"
          onClick={() => handleCategoryClick("events", "Events & Meetups")}
        >
          <h3>Events & Meetups</h3>
        </div>
        <div
          className="Categories"
          onClick={() => handleCategoryClick("hobbies", "Hobbies & Interests")}
        >
          <h3>Hobbies & Interests</h3>
        </div>
        <div
          className="Categories"
          onClick={() => handleCategoryClick("others", "Others")}
        >
          <h3>Others</h3>
        </div>
      </div>
      <button className="return-button" onClick={() => navigate("/home")}>
        Return
      </button>
    </div>
  );
};

export default ForumCategories;
