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

// Helper to check auth
const isAuthenticated = () => !!localStorage.getItem("token");

// Protected Route Component
function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

function App() {
  // 1. STATE: Track user role here
  const [role, setRole] = useState(null);

  // 2. EFFECT: Check login status when app loads
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  // 3. HANDLER: Login function (passed to Login page)
  const handleLogin = (newRole) => {
    setRole(newRole);
  };

  // 4. HANDLER: Logout function (passed to Navbar)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setRole(null); // Clear state instantly
  };

  return (
    <BrowserRouter>
   <div className="app-container">
      {/* Pass role and logout handler to Navbar */}
      {role && <Navbar user={{ role }} onLogout={handleLogout} />}
        <div className={role ? "main-content" : "w-100"}>
      <Routes>
        {/* Pass handleLogin to Login Page */}
        <Route 
          path="/login" 
          element={!role ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
        />
        
        {/* Redirect root to dashboard or login */}
        <Route 
          path="/" 
          element={role ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
        />

        {/* --- Protected Routes --- */}
        
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
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