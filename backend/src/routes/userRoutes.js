const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/roleMiddleware");
const upload = require("../config/multer");

const {
  getCreadores,
  getCreadorById,
  updateProfile,
  getIngresos,
  addFavorito,
  removeFavorito,
  getFavoritos
} = require("../controllers/userController");

// Rutas comunes o específicas por rol

// Listar creadores y ver perfil (solo para seguidores)
router.get("/creadores", verifyToken, verifyRole("seguidor"), getCreadores);
router.get("/creador/:id", verifyToken, verifyRole("seguidor"), getCreadorById);

// Favoritos (solo seguidores)
router.get("/favoritos", verifyToken, verifyRole("seguidor"), getFavoritos);
router.post("/favoritos", verifyToken, verifyRole("seguidor"), addFavorito);
router.delete("/favoritos/:creadorId", verifyToken, verifyRole("seguidor"), removeFavorito);

// Perfil de creador y reporte de ingresos (solo creadores)
router.put(
  "/profile",
  verifyToken,
  verifyRole("creador"),
  upload.fields([
    { name: "foto_perfil", maxCount: 1 },
    { name: "banner", maxCount: 1 }
  ]),
  updateProfile
);
router.get("/ingresos", verifyToken, verifyRole("creador"), getIngresos);

module.exports = router;
