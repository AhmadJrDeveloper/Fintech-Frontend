import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import imageLogin from "../../images/img.jpg";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:4000/api/users/login",
        {
          username,
          password,
        }
      );

      const token = response.data.token;
      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        setMessage(`Login failed: ${error.response.data.message}`);
      } else if (error.request) {
        setMessage("Network error. Please try again.");
      } else {
        setMessage("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={imageLogin} className="login-image" alt="Login" />
      </div>
      <div className="login-right">
        <div className="login-header">
          <h2>Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="usernameInput">Username</label>
          <input
            type="text"
            id="usernameInput"
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            autoFocus
          />
          <label htmlFor="passwordInput">Password</label>
          <input
            type="password"
            id="passwordInput"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button
            type="submit"
            disabled={!validateForm() || loading}
            className="login-button"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {message && <p className="login-alert">{message}</p>}
      </div>
    </div>
  );
}
