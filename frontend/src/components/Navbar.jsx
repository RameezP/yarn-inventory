import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; 
import { 
  FaHome, FaBoxOpen, FaClipboardList, FaExchangeAlt, FaUsers, FaSignOutAlt, FaBars, FaUserCircle 
} from "react-icons/fa";
import "../App.css";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); 

  // ✅ Get Username from Storage
  const username = localStorage.getItem("username") || "User";

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
  };

  const sidebarVariants = {
    open: { width: "260px", transition: { damping: 10 } },
    closed: { width: "70px", transition: { damping: 10 } },
  };

  const textVariants = {
    open: { opacity: 1, display: "block", transition: { delay: 0.1 } },
    closed: { opacity: 0, display: "none" } 
  };

  return (
    <motion.div 
      className="sidebar"
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      onMouseEnter={() => setIsOpen(true)} 
      onMouseLeave={() => setIsOpen(false)} 
    >
      {/* 1. Header & Toggle */}
      <div className="sidebar-brand" style={{ display: "flex", alignItems: "center", paddingLeft: "20px", height: "50px" }}>
        <FaBars style={{ fontSize: "24px", minWidth: "25px", cursor: "pointer" }} />
        <AnimatePresence>
          {isOpen && (
            <motion.span variants={textVariants} initial="closed" animate="open" exit="closed" style={{ marginLeft: "15px" }}>
              YarnMaster
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* 2. ✅ LOGGED IN USER INFO */}
      <div style={{ padding: "20px 0", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", paddingLeft: "20px" }}>
          <div style={{ minWidth: "30px", fontSize: "30px", color: "var(--accent-color)" }}>
            <FaUserCircle />
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div variants={textVariants} initial="closed" animate="open" exit="closed" style={{ marginLeft: "15px" }}>
                <small style={{ color: "#aaa", fontSize: "11px", textTransform: "uppercase" }}>Logged in as</small>
                <div style={{ fontWeight: "bold", fontSize: "16px", color: "white" }}>{username}</div>
                <div style={{ fontSize: "12px", color: "#1abc9c" }}>{user?.role === 'admin' ? 'Administrator' : 'Staff'}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Menu Items */}
      <ul className="sidebar-menu">
        <NavItem to="/dashboard" icon={<FaHome />} label="Dashboard" isOpen={isOpen} textVariants={textVariants} />
        {user?.role === "admin" && (
          <>
            <NavItem to="/materials" icon={<FaBoxOpen />} label="Materials" isOpen={isOpen} textVariants={textVariants} />
            <NavItem to="/inventory" icon={<FaClipboardList />} label="Inventory" isOpen={isOpen} textVariants={textVariants} />
            <NavItem to="/transactions" icon={<FaExchangeAlt />} label="Transactions" isOpen={isOpen} textVariants={textVariants} />
            <NavItem to="/users" icon={<FaUsers />} label="Users" isOpen={isOpen} textVariants={textVariants} />
          </>
        )}
      </ul>

      <button onClick={handleLogout} className="logout-btn">
        <FaSignOutAlt className="sidebar-icon" />
        <AnimatePresence>
          {isOpen && <motion.span variants={textVariants} initial="closed" animate="open" exit="closed">Logout</motion.span>}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}

function NavItem({ to, icon, label, isOpen, textVariants }) {
  return (
    <li>
      <NavLink to={to} className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
        <span className="sidebar-icon">{icon}</span>
        <AnimatePresence>
          {isOpen && <motion.span variants={textVariants} initial="closed" animate="open" exit="closed">{label}</motion.span>}
        </AnimatePresence>
      </NavLink>
    </li>
  );
}