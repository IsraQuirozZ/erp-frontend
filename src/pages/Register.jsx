import api from "../api/axios";
import { useState } from "react";
import "../styles/login.css";
import { FaLock } from "react-icons/fa";
import { FaGoogle, FaGithub } from "react-icons/fa";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{9,12}$/;

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [success, setSuccess] = useState(false);

  // 🔹 errors -> FRONTEND
  const [errors, setErrors] = useState({});

  // 🔹 errors -> BACKEND
  const [error, setError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    } else if (form.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (/\d/.test(form.username)) {
      newErrors.username = "Username cannot contain numbers";
    }

    if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!passwordRegex.test(form.password)) {
      newErrors.password =
        "Password must be 9-12 chars, 1 uppercase, 1 number and 1 special character";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      await api.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
        password2: form.confirmPassword,
      });

      console.log("User registered successfully");
      setSuccess(true);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Unexpected error");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-header">
        <div className="login-logo">
          <FaLock />
        </div>
        <h1>IQ-ERP</h1>
        <p>Create your account</p>
      </div>

      <div className="login-card">
        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>User Name</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="John Doe"
          />
          {errors.username && <small>{errors.username}</small>}

          <label>Email Address</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="email@hotmail.com"
          />
          {errors.email && <small>{errors.email}</small>}

          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Enter your password"
          />
          {errors.password && <small>{errors.password}</small>}

          <label>Confirm Password</label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            placeholder="Repeat your password"
          />
          {errors.confirmPassword && <small>{errors.confirmPassword}</small>}

          <button type="submit" className="login-btn signup">
            Sign Up
          </button>
        </form>

        <div className="divider">
          <span>Or continue with</span>
        </div>

        <div className="social-login">
          <button>
            <FaGoogle />
            Google
          </button>
          <button>
            <FaGithub />
            GitHub
          </button>
        </div>

        <p className="signup-text">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>

      <footer className="login-footer">2025 IQ ERP, All rights reserved</footer>
      {success && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Account created 🎉</h2>
            <p>Your account has been created successfully.</p>
            <button
              className="login-btn"
              onClick={() => (window.location.href = "/login")}
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
