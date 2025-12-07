const express = require("express");
const router = express.Router();

const { getTransactions } = require("../controllers/transactionController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getTransactions);

module.exports = router;
