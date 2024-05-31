// frontend/src/components/Register.js
import React, { useState } from "react";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    fullname: '',
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/register', formData);
      console.log('Registration successful:', response.data);
      // Optionally handle successful registration (e.g., redirect to login page)
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="input-container">
          <label htmlFor="fullname">Fullname</label>
          <input type="text" id="fullname" name="fullname" value={formData.fullname} onChange={handleChange} required />
        </div>
        <div className="input-container">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className="input-container">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <button type="submit" className="register-button">
          Register
        </button>
      </form>
      <div className="login-link">
        <span>Already have an account?</span> <a href="/login">Login</a>
      </div>
    </div>
  );
};

export default Register;
