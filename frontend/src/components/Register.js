import React from "react";
import "./Register.css";

const Register = () => {
  return (
    <div className="register-container">
      <h2>Register</h2>
      <form>
        <div className="input-container">
          <label htmlFor="Fullname">Fullname</label>
          <input type="text" id="Fullname" name="Fullname" required />
        </div>
        <div className="input-container">
          <label htmlFor="Gender">Gender</label>
          <select id="Gender" name="Gender" required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
        <div className="input-container">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="input-container">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <div className="input-container">
          <label>Activities</label>
          <div className="checkbox-container">
            <label>
              <input type="checkbox" name="activities" value="Swimming" />{" "}
              Swimming
            </label>
            <label>
              <input type="checkbox" name="activities" value="Running" />{" "}
              Running
            </label>
            <label>
              <input type="checkbox" name="activities" value="Jogging" />{" "}
              Jogging
            </label>
          </div>
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
