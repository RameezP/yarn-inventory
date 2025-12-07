// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // check user exists
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(400).json({ message: "Invalid username" });
    }
    
    console.log("DEBUG username:", username);
    console.log("DEBUG raw input password:", password);
    console.log("DEBUG stored hash:", user.password_hash);

    // check password (use password_hash)
    const validPass = await bcrypt.compare(password, user.password_hash);


    if (!validPass) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role,   // so frontend knows
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
