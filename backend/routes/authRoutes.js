// routes/authRoutes.js
const express = require("express");
const router = express.Router();

const { login } = require("../controllers/authController");

// POST /api/auth/login
router.post("/login", login);

router.get("/create-admin", async (req, res) => {
  const bcrypt = require("bcryptjs");
  const User = require("../models/User");

  const password_hash = await bcrypt.hash("admin123", 10);

  await User.create({
    username: "admin",
    password_hash,
    role: "admin"
  });

  res.json({
    message: "Admin created successfully",
    username: "admin",
    password: "admin123",
    password_hash
  });
});

// --- FORCE FIX ROUTE (Paste this into authRoutes.js) ---
router.get("/fix-admin", async (req, res) => {
  try {
    const User = require("../models/User");
    const bcrypt = require("bcryptjs");

    // 1. Force DELETE the broken user
    await User.destroy({ where: { username: "admin" } });

    // 2. Create a FRESH admin user
    const hash = await bcrypt.hash("admin123", 10);
    
    await User.create({
      username: "admin",
      password_hash: hash,
      role: "admin"
    });

    res.json({ message: "✅ ADMIN FIXED! You can login now." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// -------------------------------------------------------


module.exports = router;
