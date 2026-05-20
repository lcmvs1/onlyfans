const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/roleMiddleware");

const { createComment } = require("../controllers/commentController");

// Ruta para dejar comentarios (Solo seguidores)
router.post("/", verifyToken, verifyRole("seguidor"), createComment);

module.exports = router;
