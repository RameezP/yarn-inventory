const Material = require("../models/Material");
const { Op } = require("sequelize"); // Import Op for case-insensitive check

exports.getMaterials = async (req, res) => {
  try {
    const materials = await Material.findAll();
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.addMaterial = async (req, res) => {
  let { name, unit } = req.body;

  // 1. Basic Validation
  if (!name || !unit) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // 2. Sanitize Input
  name = name.trim();
  
  // 3. Regex Validation (Allow Letters, Numbers, Space, Hyphen ONLY)
  const nameRegex = /^[a-zA-Z0-9\s-]+$/;
  if (!nameRegex.test(name)) {
    return res.status(400).json({ 
      message: "Invalid name. Only letters, numbers, spaces, and hyphens allowed." 
    });
  }

  try {
    // 4. Duplicate Check (Case Insensitive)
    const existing = await Material.findOne({
      where: {
        name: { [Op.like]: name } // 'Cotton' will match 'cotton'
      }
    });

    if (existing) {
      return res.status(400).json({ message: "Material name already exists" });
    }

    const newMaterial = await Material.create({ name, unit });
    res.json({ message: "Material added", material: newMaterial });
  } catch (err) {
    console.error("Add Material Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteMaterial = async (req, res) => {
  const { id } = req.params;

  try {
    // 5. Role Validation (Extra Safety)
    if(req.user.role !== 'admin') {
       return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const deleted = await Material.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "Material not found" });
    }

    res.json({ message: "Material deleted" });
  } catch (err) {
    // Handle Foreign Key Error (Cannot delete if used in inventory)
    if (err.name === 'SequelizeForeignKeyConstraintError') {
       return res.status(400).json({ message: "Cannot delete: Material has associated inventory/transactions." });
    }
    res.status(500).json({ message: "Server error" });
  }
};