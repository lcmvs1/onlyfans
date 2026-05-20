const pool = require("../db/db");

const getCreadores = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, email, rol, foto_perfil, banner, meta_titulo, meta_descripcion 
       FROM usuarios 
       WHERE rol = 'creador' 
       ORDER BY nombre ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener creadores:", error);
    res.status(500).json({ message: "Error del servidor al obtener creadores" });
  }
};

const getCreadorById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT id, nombre, email, rol, foto_perfil, banner, meta_titulo, meta_descripcion 
       FROM usuarios 
       WHERE id = $1 AND rol = 'creador'`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Creador no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener creador:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nombre, meta_titulo, meta_descripcion } = req.body;

    const currentProfile = await pool.query(
      "SELECT nombre, foto_perfil, banner, meta_titulo, meta_descripcion FROM usuarios WHERE id = $1",
      [userId]
    );

    if (currentProfile.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    let foto_perfil = currentProfile.rows[0].foto_perfil;
    let banner = currentProfile.rows[0].banner;

    if (req.files) {
      if (req.files.foto_perfil) {
        foto_perfil = `/uploads/${req.files.foto_perfil[0].filename}`;
      }
      if (req.files.banner) {
        banner = `/uploads/${req.files.banner[0].filename}`;
      }
    }

    const updatedUser = await pool.query(
      `UPDATE usuarios 
       SET nombre = $1, foto_perfil = $2, banner = $3, meta_titulo = $4, meta_descripcion = $5 
       WHERE id = $6 
       RETURNING id, nombre, email, rol, foto_perfil, banner, meta_titulo, meta_descripcion`,
      [
        nombre || currentProfile.rows[0].nombre,
        foto_perfil,
        banner,
        meta_titulo !== undefined ? meta_titulo : currentProfile.rows[0].meta_titulo,
        meta_descripcion !== undefined ? meta_descripcion : currentProfile.rows[0].meta_descripcion,
        userId
      ]
    );

    res.json({
      message: "Perfil actualizado correctamente",
      user: updatedUser.rows[0]
    });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ message: "Error del servidor al actualizar perfil" });
  }
};

const getIngresos = async (req, res) => {
  try {
    const creadorId = req.user.id;
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        message: "Debe proporcionar fechaInicio y fechaFin (Formato: YYYY-MM-DD)"
      });
    }

    const query = `
      SELECT d.id, d.cantidad_flanes, d.monto, d.created_at, u.nombre AS seguidor_nombre
      FROM donaciones d
      JOIN usuarios u ON d.seguidor_id = u.id
      WHERE d.creador_id = $1 AND d.created_at >= $2::timestamp AND d.created_at <= ($3::text || ' 23:59:59')::timestamp
      ORDER BY d.created_at DESC
    `;

    const result = await pool.query(query, [creadorId, fechaInicio, fechaFin]);

    let totalFlanes = 0;
    let totalMonto = 0;

    result.rows.forEach(row => {
      totalFlanes += parseInt(row.cantidad_flanes);
      totalMonto += parseFloat(row.monto);
    });

    res.json({
      historial: result.rows,
      totalFlanes,
      totalMonto
    });
  } catch (error) {
    console.error("Error al obtener reporte de ingresos:", error);
    res.status(500).json({ message: "Error del servidor al generar reporte de ingresos" });
  }
};

const addFavorito = async (req, res) => {
  try {
    const seguidorId = req.user.id;
    const { creadorId } = req.body;

    if (!creadorId) {
      return res.status(400).json({ message: "Debe proporcionar creadorId" });
    }

    const isCreator = await pool.query("SELECT rol FROM usuarios WHERE id = $1", [creadorId]);
    if (isCreator.rows.length === 0 || isCreator.rows[0].rol !== "creador") {
      return res.status(400).json({ message: "El usuario a seguir no existe o no es un creador" });
    }

    await pool.query(
      `INSERT INTO favoritos (seguidor_id, creador_id) 
       VALUES ($1, $2) 
       ON CONFLICT (seguidor_id, creador_id) DO NOTHING`,
      [seguidorId, creadorId]
    );

    res.json({ message: "Creador agregado a favoritos" });
  } catch (error) {
    console.error("Error al agregar favorito:", error);
    res.status(500).json({ message: "Error al agregar a favoritos" });
  }
};

const removeFavorito = async (req, res) => {
  try {
    const seguidorId = req.user.id;
    const { creadorId } = req.params;

    await pool.query(
      "DELETE FROM favoritos WHERE seguidor_id = $1 AND creador_id = $2",
      [seguidorId, creadorId]
    );

    res.json({ message: "Creador eliminado de favoritos" });
  } catch (error) {
    console.error("Error al eliminar favorito:", error);
    res.status(500).json({ message: "Error al eliminar de favoritos" });
  }
};

const getFavoritos = async (req, res) => {
  try {
    const seguidorId = req.user.id;
    const query = `
      SELECT u.id, u.nombre, u.email, u.foto_perfil, u.banner, u.meta_titulo, u.meta_descripcion
      FROM favoritos f
      JOIN usuarios u ON f.creador_id = u.id
      WHERE f.seguidor_id = $1
      ORDER BY u.nombre ASC
    `;
    const result = await pool.query(query, [seguidorId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    res.status(500).json({ message: "Error al obtener favoritos" });
  }
};

module.exports = {
  getCreadores,
  getCreadorById,
  updateProfile,
  getIngresos,
  addFavorito,
  removeFavorito,
  getFavoritos
};
