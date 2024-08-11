import React, { useState } from "react";
import emailjs from "emailjs-com";
import "../Style.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  // we used chat gpt helps for this
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

      await emailjs
        .send(
          "service_jfmlggb",
          "template_fx34iqr",
          templateParams,
          "h1VRX5prAELaGTTuh"
        )
        .then((response) => {
          console.log(
            "Email successfully sent!",
            response.status,
            response.text
          );
          setMessage("Email sent");
        })
        .catch((err) => {
          console.error("Failed to send email:", err);
          setMessage("Failed to send email");
        });
    } catch (error) {
      console.error("Error sending reset email:", error);
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="forgot-password">
      <div className="forgot-password-container">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          {message && <div className="message2">{message}</div>}
          <div className="input-container2">
            <label htmlFor="email">Email</label>
            <input
              type="email2"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button2">
            Submit
          </button>
        </form>
        <a href="/login" className="return-link">
          &lt; Back to Login
        </a>
      </div>
    </div>
  );
};

export default ForgotPassword;
