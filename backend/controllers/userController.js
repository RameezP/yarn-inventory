const User = require("../models/User");
const bcrypt = require("bcryptjs");

const ROOT_ADMIN = "admin"; 

exports.getAllUsers = async (req, res) => {
  try {
    // ✅ Include 'phone' in the result
    const users = await User.findAll({
      attributes: ["id", "username", "role", "phone"] 
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createUser = async (req, res) => {
  try {
    // ✅ Get phone from body
    const { username, password, role, phone } = req.body; 
    const requestor = req.user;

    if (requestor.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
    }

    if (role === 'admin' && requestor.username !== ROOT_ADMIN) {
        return res.status(403).json({ message: "Only Root Admin can create Admins." });
    }

    // ✅ Validate Phone
    if (!phone) {
        return res.status(400).json({ message: "Phone number is required" });
    }
    // Simple Regex: Allows 10-15 digits
    if (!/^\d{10,15}$/.test(phone)) {
        return res.status(400).json({ message: "Invalid phone number (10-15 digits required)" });
    }

    if (!username || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (/\s/.test(username)) {
        return res.status(400).json({ message: "Username cannot contain spaces" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Weak password!" });
    }

    if (!['admin', 'user'].includes(role)) {
        return res.status(400).json({ message: "Invalid role selected" });
    }

    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hash = await bcrypt.hash(password, 12);

    await User.create({
      username,
      password_hash: hash,
      role,
      phone // ✅ Save Phone
    });

    res.json({ message: "User created successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ... keep deleteUser as it was ...
exports.deleteUser = async (req, res) => {
    // (Paste your existing deleteUser code here or keep it if you didn't delete it)
    const { id } = req.params;
    const requestor = req.user; 

    try {
        if (requestor.username !== ROOT_ADMIN) {
            return res.status(403).json({ message: "⛔ Access Denied. Only Root Admin can delete users." });
        }
        const targetUser = await User.findByPk(id);
        if(!targetUser) return res.status(404).json({ message: "User not found" });
        if (targetUser.username === ROOT_ADMIN) return res.status(400).json({ message: "CRITICAL: Root Admin cannot be deleted!" });

        await targetUser.destroy();
        res.json({ message: "User deleted successfully" });
    } catch(err) {
        res.status(500).json({ message: "Error deleting user" });
    }
};