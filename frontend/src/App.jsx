import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Materials from "./pages/Materials";
import Inventory from "./pages/Inventory";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";

import Navbar from "./components/Navbar";
import "./App.css";

// Log API URL (debug)
console.log("Frontend API URL =", process.env.REACT_APP_API_URL);

// Helper to check auth
const isAuthenticated = () => !!localStorage.getItem("token");

// Protected Route Component
function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

function App() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const handleLogin = (newRole) => {
    setRole(newRole);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setRole(null);
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        {role && <Navbar user={{ role }} onLogout={handleLogout} />}
        <div className={role ? "main-content" : "w-100"}>
          <Routes>
            <Route
              path="/login"
              element={!role ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />}
            />

            <Route
              path="/"
              element={role ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
            />

            <Route
              path="/dashboard"
              element={<PrivateRoute><Dashboard /></PrivateRoute>}
            />

            <Route
              path="/materials"
              element={
                <PrivateRoute>
                  {role === "admin" ? <Materials /> : <h3 className="text-center mt-5">Access Denied</h3>}
                </PrivateRoute>
              }
            />

            <Route
              path="/users"
              element={
                <PrivateRoute>
                  {role === "admin" ? <Users /> : <h3 className="text-center mt-5">Access Denied</h3>}
                </PrivateRoute>
              }
            />

            <Route
              path="/inventory"
              element={
                <PrivateRoute>
                  {role === "admin" ? <Inventory /> : <h3 className="text-center mt-5">Access Denied</h3>}
                </PrivateRoute>
              }
            />

            <Route
              path="/transactions"
              element={
                <PrivateRoute>
                  {role === "admin" ? <Transactions /> : <h3 className="text-center mt-5">Access Denied</h3>}
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
