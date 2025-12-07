// controllers/dashboardController.js
const Inventory = require("../models/Inventory");
const Transaction = require("../models/Transaction");
const Material = require("../models/Material");
const { Sequelize } = require("sequelize");

exports.getStats = async (req, res) => {
  try {
    const materialsCount = await Material.count();
    const transactionsCount = await Transaction.count();

    res.json({
      materials: materialsCount,
      transactions: transactionsCount
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMaterialStockChart = async (req, res) => {
  try {
    const data = await Inventory.findAll({
      include: [{ model: Material, attributes: ["name"] }]
    });

    res.json(
      data.map((item) => ({
        name: item.Material.name,
        quantity: item.quantity
      }))
    );
  } catch (err) {
    console.error("Stock Chart Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTransactionSummary = async (req, res) => {
  try {
    const IN = await Transaction.sum("amount", { where: { change_type: "IN" } });
    const OUT = await Transaction.sum("amount", { where: { change_type: "OUT" } });

    res.json({ IN: IN || 0, OUT: OUT || 0 });
  } catch (err) {
    console.error("Transaction Summary Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStockTrend = async (req, res) => {
  try {
    const logs = await Transaction.findAll({
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("timestamp")), "date"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
      ],
      group: ["date"],
      order: [["date", "ASC"]],
    });

    res.json(logs);
  } catch (err) {
    console.error("Stock Trend Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
