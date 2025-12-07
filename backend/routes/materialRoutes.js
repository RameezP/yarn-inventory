const express = require("express");
const router = express.Router();

const { getMaterials, addMaterial, deleteMaterial } = require("../controllers/materialController");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/materials
router.get("/", authMiddleware, getMaterials);

// POST /api/materials
router.post("/", authMiddleware, addMaterial);

// DELETE /api/materials/:id
router.delete("/:id", authMiddleware, deleteMaterial);

module.exports = router;
