import { useState } from "react";
import api from "../api/axios";
import "../styles/login.css";

function CreateUser() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    role: "USER",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/auth/users", form); // endpoint admin-only
      setSuccess("User created successfully");
      setForm({
        username: "",
        email: "",
        password: "",
        password2: "",
        role: "USER",
      });
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Unexpected error");
      }
    }
  };

  return (
    <div>
      <h1>Create User</h1>
      <div className="create-user">
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        <form onSubmit={handleSubmit} className="login-card">
          <label>Username</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            value={form.password2}
            onChange={(e) => setForm({ ...form, password2: e.target.value })}
          />

          <label>Role</label>
          <input
            type="text"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="role-input"
          />

          <button className="login-btn" type="submit">
            Create User
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateUser;
