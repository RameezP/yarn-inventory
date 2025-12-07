const Inventory = require("../models/Inventory");
const Material = require("../models/Material");
const Transaction = require("../models/Transaction");
const sequelize = require("../config/db");

// Helper to validate amount
const isValidAmount = (amt) => {
  // 1. Check if empty
  if (!amt || isNaN(amt)) return false;
  // 2. Check if negative or zero
  if (Number(amt) <= 0) return false;
  // 3. Check if too huge
  if (Number(amt) > 1000000) return false;
  return true;
};

exports.getInventory = async (req, res) => {
  try {
    const materials = await Material.findAll();
    for (const m of materials) {
      const exists = await Inventory.findOne({ where: { material_id: m.id } });
      if (!exists) {
        await Inventory.create({ material_id: m.id, quantity: 0 });
      }
    }
    const data = await Inventory.findAll({
      include: [{ model: Material, attributes: ["name", "unit"] }],
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.stockIn = async (req, res) => {
  const { material_id, amount } = req.body;

  // 1. CHECK VALIDITY
  if (!isValidAmount(amount)) {
    return res.status(400).json({ message: "Invalid amount. Must be positive (+)." });
  }

  // ⚠️ DEFINING MAX CAPACITY (e.g., Warehouse limit)
  const MAX_CAPACITY = 5000; 

  const t = await sequelize.transaction();

  try {
    const item = await Inventory.findOne({ where: { material_id } });

    // Calculate projected total
    const currentQty = item ? Number(item.quantity) : 0;
    const newTotal = currentQty + Number(amount);

    // 2. CHECK CAPACITY
    if (newTotal > MAX_CAPACITY) {
      await t.rollback();
      return res.status(400).json({ 
        message: `Warehouse limit reached! Max allowed: ${MAX_CAPACITY} ${item?.Material?.unit || 'units'}. Current: ${currentQty}` 
      });
    }

    if (!item) {
      await Inventory.create({ material_id, quantity: amount }, { transaction: t });
    } else {
      item.quantity = newTotal;
      await item.save({ transaction: t });
    }

    await Transaction.create({
      material_id,
      change_type: "IN",
      amount,
    }, { transaction: t });

    await t.commit();
    res.json({ message: "Stock added successfully" });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.stockOut = async (req, res) => {
  const { material_id, amount } = req.body;

  // 1. Role Validation
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied" });
  }

  // 2. Input Validation
  if (!isValidAmount(amount)) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const t = await sequelize.transaction();

  try {
    const item = await Inventory.findOne({ where: { material_id } });

    if (!item) {
      await t.rollback();
      return res.status(400).json({ message: "Material has no stock yet" });
    }

    // 3. Logic Validation (Prevent Negative Stock)
    if (Number(item.quantity) < Number(amount)) {
      await t.rollback();
      return res.status(400).json({ message: `Not enough stock! Current: ${item.quantity}` });
    }

    item.quantity = Number(item.quantity) - Number(amount);
    await item.save({ transaction: t });

    await Transaction.create({
      material_id,
      change_type: "OUT",
      amount,
    }, { transaction: t });

    await t.commit();
    res.json({ message: "Stock removed successfully" });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: "Server error" });
  }
};