const express = require("express");
const router = express.Router();

const { getInventory, stockIn, stockOut } = require("../controllers/inventoryController");
const authMiddleware = require("../middleware/authMiddleware");

// GET inventory list
router.get("/", authMiddleware, getInventory);

// Stock IN
router.post("/in", authMiddleware, stockIn);

// Stock OUT
router.post("/out", authMiddleware, stockOut);

module.exports = router;
