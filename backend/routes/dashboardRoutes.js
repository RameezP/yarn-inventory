// routes/dashboardRoutes.js
const express = require("express");

const router = express.Router();
const Transaction = require("../models/Transaction");
const Material = require("../models/Material");
const Inventory = require("../models/Inventory");

const auth = require("../middleware/authMiddleware");

const { getStats } = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");
const {
    getMaterialStockChart,
    getTransactionSummary,
    getStockTrend
} = require("../controllers/dashboardController");

router.get("/material-stocks", authMiddleware, getMaterialStockChart);
router.get("/transaction-summary", authMiddleware, getTransactionSummary);
router.get("/stock-trend", authMiddleware, getStockTrend);
router.get("/inventory-summary", auth, async (req, res) => {
    try {
        const materials = await Material.findAll({
            include: [
                {
                    model: Inventory,
                    attributes: ["quantity"]
                }
            ]
        });

        const transactions = await Transaction.findAll();

        const summary = materials.map((m) => {
            const materialTransactions = transactions.filter(t => t.material_id === m.id);

            const totalIN = materialTransactions
                .filter(t => t.change_type === "IN")
                .reduce((sum, t) => sum + Number(t.amount), 0);

            const totalOUT = materialTransactions
                .filter(t => t.change_type === "OUT")
                .reduce((sum, t) => sum + Number(t.amount), 0);


            return {
                id: m.id,
                name: m.name,
                unit: m.unit,
                stock: m.Inventory?.quantity ?? 0,
                totalIN,
                totalOUT
            };
        });

        res.json(summary);

    } catch (err) {
        console.error("Summary Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/stats", authMiddleware, getStats);

module.exports = router;
