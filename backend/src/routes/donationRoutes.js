const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/roleMiddleware");

const {
  donateFlan,
  getDonationsHistory
} = require("../controllers/donationController");

// Ambas rutas son exclusivas para seguidores
router.post("/", verifyToken, verifyRole("seguidor"), donateFlan);
router.get("/history", verifyToken, verifyRole("seguidor"), getDonationsHistory);

module.exports = router;
