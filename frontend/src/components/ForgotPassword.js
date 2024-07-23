import React, { useState } from "react";
import emailjs from "emailjs-com";
import "../Style.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/check-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        setMessage("Email not found");
        return;
      }

      const { resetLink } = await response.json();

      const templateParams = {
        user_email: email,
        message: `You requested a password reset. Click the link below to reset your password: ${resetLink}`,
      };

      await emailjs.send(
        "service_jfmlggb",
        "template_fx34iqr",
        templateParams,
        "h1VRX5prAELaGTTuh"
      )
      .then(response => {
        console.log('Email successfully sent!', response.status, response.text);
        setMessage("Email sent");
      })
      .catch(err => {
        console.error('Failed to send email:', err);
        setMessage("Failed to send email");
      });

    } catch (error) {
      console.error("Error sending reset email:", error);
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        {message && <div className="message">{message}</div>}
        <div className="input-container">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
