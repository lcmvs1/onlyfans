const verifyRole = (...roles) => {

  return (req, res, next) => {

    try {

      if (!req.user) {
        return res.status(401).json({
          message: "No autorizado"
        });
      }

      if (!roles.includes(req.user.rol)) {
        return res.status(403).json({
          message: "Acceso denegado"
        });
      }

      next();

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        message: "Error del servidor"
      });

    }

  };

};

module.exports = verifyRole;