const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  createUser,
  deleteUser
} = require("../controllers/userController");

const auth = require("../middleware/authMiddleware");

router.get("/", auth, getAllUsers);
router.post("/", auth, createUser);
router.delete("/:id", auth, deleteUser);

module.exports = router;
