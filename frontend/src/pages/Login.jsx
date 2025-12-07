import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaKey } from "react-icons/fa";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", form);

      // 1. Save Token & Role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // ✅ 2. NEW: Save Username (Required for Root Admin check)
      // Make sure your backend authController sends 'user' object in response
      if (res.data.user && res.data.user.username) {
        localStorage.setItem("username", res.data.user.username);
      } else {
        // Fallback if backend structure differs, though controller code showed it sends 'user'
        localStorage.setItem("username", form.username); 
      }

      // 3. Update App State
      if (onLogin) {
        onLogin(res.data.role);
      }

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div 
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decorative Circles */}
      <div style={{
        position: "absolute", top: "-50px", left: "-50px",
        width: "200px", height: "200px", background: "rgba(255,255,255,0.1)",
        borderRadius: "50%"
      }}></div>
      <div style={{
        position: "absolute", bottom: "-50px", right: "-50px",
        width: "300px", height: "300px", background: "rgba(255,255,255,0.05)",
        borderRadius: "50%"
      }}></div>

      {/* Login Card */}
      <div 
        className="card shadow-lg p-5" 
        style={{ 
          width: "400px", 
          borderRadius: "20px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          backgroundColor: "rgba(255, 255, 255, 0.85)", 
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)"
        }}
      >
        <div className="text-center mb-4">
          <div 
            style={{
              width: "70px", height: "70px", margin: "0 auto",
              background: "rgba(255, 255, 255, 0.5)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--accent-color)", fontSize: "30px"
            }}
          >
            <FaKey />
          </div>
          <h3 className="fw-bold mt-3 text-dark">Welcome Back</h3>
          <p className="text-muted">Yarn Inventory System</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 text-center small">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* Username Field */}
          <div className="mb-3 position-relative">
            <span style={{ position: "absolute", left: "15px", top: "12px", color: "#666" }}>
              <FaUser />
            </span>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              style={{ 
                paddingLeft: "40px", 
                height: "45px", 
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.6)",
                border: "1px solid rgba(0,0,0,0.1)"
              }}
            />
          </div>

          {/* Password Field */}
          <div className="mb-4 position-relative">
            <span style={{ position: "absolute", left: "15px", top: "12px", color: "#666" }}>
              <FaLock />
            </span>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              style={{ 
                paddingLeft: "40px", 
                height: "45px", 
                borderRadius: "10px", 
                background: "rgba(255, 255, 255, 0.6)",
                border: "1px solid rgba(0,0,0,0.1)"
              }}
            />
          </div>

          <button
            type="submit"
            className="btn w-100 fw-bold shadow-sm"
            disabled={loading}
            style={{
              backgroundColor: "var(--primary-color)",
              color: "white",
              height: "45px",
              borderRadius: "10px",
              transition: "0.3s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "var(--secondary-color)"}
            onMouseOut={(e) => e.target.style.backgroundColor = "var(--primary-color)"}
          >
            {loading ? "Authenticating..." : "Login to Dashboard"}
          </button>
        </form>
        
        <div className="text-center mt-4 text-muted small">
          © 2024 Yarn Factory System
        </div>
      </div>
    </div>
  );
}