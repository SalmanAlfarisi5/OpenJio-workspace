import React from "react";
import "./Register.css";

const Register = () => {
  return (
    <div className="register-container">
      <h2>Register</h2>

      <form>
        <div className="input-container">
          <label htmlFor="Email">Email</label>
          <input type="Email" id="Email" name="Email" required />
        </div>
        <div className="input-container">
          <label htmlFor="Fullname">Fullname</label>
          <input type="text" id="Fullname" name="Fullname" required />
        </div>
        <div className="input-container">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="input-container">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
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
