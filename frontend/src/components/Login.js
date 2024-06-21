import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegisterLogin.css";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", formData);
      console.log("Login successful:", response.data);
      setSuccess("Login successful!");
      setError("");
      localStorage.setItem("token", response.data.token);
      navigate("/activities");
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error);
        setSuccess("");
      } else {
        console.error("Error logging in:", error);
        setError("An unexpected error occurred.");
        setSuccess("");
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="message error-message">{error}</div>}
        {success && <div className="message success-message">{success}</div>}
        <div className="input-container">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-container">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Login
        </button>
      </form>
      <div className="link-container">
        <span>Don't have an account?</span> <a href="/register">Register</a>
      </div>
    </div>
  );
};

export default Login;
