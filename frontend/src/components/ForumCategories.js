import { useNavigate } from "react-router-dom";
import "../Style.css";

const ForumCategories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate("../forum");
  };

  return (
    <div className="ForumCategories">
      <div className="BlockCategories">
        <h1>Categories</h1>
        <div
          className="Categories"
          onClick={() => handleCategoryClick("general")}
        >
          <h3>General</h3>
        </div>
        <div
          className="Categories"
          onClick={() => handleCategoryClick("events")}
        >
          <h3>Events & Meetups</h3>
        </div>
        <div
          className="Categories"
          onClick={() => handleCategoryClick("hobbies")}
        >
          <h3>Hobbies & Interests</h3>
        </div>
        <div
          className="Categories"
          onClick={() => handleCategoryClick("others")}
        >
          <h3>Others</h3>
        </div>
      </div>
      <button className="return-button" onClick={() => navigate("/home")}>
        return
      </button>
    </div>
  );
};

export default ForumCategories;
