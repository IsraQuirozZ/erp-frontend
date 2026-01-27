import api from "../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { FaLock, FaGoogle, FaGithub } from "react-icons/fa";
import { useAuth } from "../auth/AuthContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // 🔹 errores FRONTEND
  const [errors, setErrors] = useState({});

  // 🔹 error BACKEND
  const [error, setError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      const response = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      login(response.data.token, response.data.user);
      navigate("/app/dashboard");
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
        <p>Sign in to your account</p>
      </div>

      <div className="login-card">
        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
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

          <div className="login-options">
            <div className="remember">
              <input type="checkbox" />
              <label>Remember me</label>
            </div>
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>

        <div className="continue">
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
          Don’t have an account? <a href="/register">Sign up</a>
        </p>
      </div>

      <footer className="login-footer">2025 IQ ERP, All rights reserved</footer>
    </div>
  );
}

export default Login;
