const Transaction = require("../models/Transaction");
const Material = require("../models/Material");

exports.getTransactions = async (req, res) => {
  try {
    const logs = await Transaction.findAll({
      include: [{ model: Material, attributes: ["name", "unit"] }],
      order: [["timestamp", "DESC"]]
    });

    res.json(logs);

  } catch (err) {
    console.error("Get Transactions Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
