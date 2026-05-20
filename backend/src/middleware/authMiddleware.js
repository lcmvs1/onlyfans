const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({
        message: "Acceso denegado. No se proporcionó un token."
      });
    }

    // Se espera el formato "Bearer <token>"
    const token = authHeader.split(" ")[1] || authHeader;
    if (!token) {
      return res.status(401).json({
        message: "Formato de token inválido."
      });
    }

    const decoded = jwt.verify(token, "secretkey"); // Usamos "secretkey" por compatibilidad con login/register
    req.user = decoded; // decoded contiene { id, rol }
    next();
  } catch (error) {
    console.error("Error de verificación de token:", error.message);
    return res.status(401).json({
      message: "Token inválido o expirado."
    });
  }
};

module.exports = verifyToken;
