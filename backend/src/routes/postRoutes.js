const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/roleMiddleware");
const upload = require("../config/multer");

const {
  createPost,
  getPosts,
  getFeed
} = require("../controllers/postController");

// Ruta para crear publicaciones (Solo creadores)
router.post(
  "/create",
  verifyToken,
  verifyRole("creador"),
  upload.single("imagen"),
  createPost
);

// Feed de publicaciones del seguidor (Favoritos + Donados)
router.get("/feed", verifyToken, verifyRole("seguidor"), getFeed);

// Obtener publicaciones de un creador (Para creadores o seguidores autorizados)
router.get("/", verifyToken, getPosts);

module.exports = router;
