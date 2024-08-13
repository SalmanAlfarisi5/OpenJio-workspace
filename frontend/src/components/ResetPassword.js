import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Style.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    if (!token) {
      setMessage("Invalid or expired reset token");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters");
      return;
    }
    try {
      await axios.post("/api/reset-password", { token, password });
      setMessage("Password reset successful");
      navigate("/login");
    } catch (error) {
      setMessage("Failed to reset password");
      console.error(error);
    }
  };

  return (
    <div className="reset-password">
      <div className="reset-password-container">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          {message && <div className="message2">{message}</div>}
          <div className="input-container2">
            <label htmlFor="password">New Password</label>
            <input
              type="password2"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-container2">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password2"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button2">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
