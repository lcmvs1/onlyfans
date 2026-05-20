const pool = require("../db/db");

const createPost = async (req, res) => {
  try {
    const creadorId = req.user.id;
    const { titulo, contenido } = req.body;

    let imagen = null;
    if (req.file) {
      imagen = `/uploads/${req.file.filename}`;
    }

    const result = await pool.query(
      `INSERT INTO posts (creador_id, titulo, contenido, imagen) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [creadorId, titulo, contenido, imagen]
    );

    res.status(201).json({
      message: "Publicación creada con éxito",
      post: result.rows[0]
    });
  } catch (error) {
    console.error("Error al crear publicación:", error);
    res.status(500).json({ message: "Error al crear la publicación" });
  }
};

const getPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.rol;
    const { creadorId } = req.query;

    if (!creadorId) {
      return res.status(400).json({ message: "Debe proporcionar creadorId" });
    }

    if (userRole === "creador") {
      if (parseInt(creadorId) !== userId) {
        return res.status(403).json({
          message: "Acceso denegado. Un creador no puede ver posts de otros creadores."
        });
      }

      const postsQuery = await pool.query(
        "SELECT * FROM posts WHERE creador_id = $1 ORDER BY created_at DESC",
        [creadorId]
      );

      const posts = postsQuery.rows;
      for (let post of posts) {
        const commentsQuery = await pool.query(
          `SELECT c.id, c.contenido, c.created_at, u.nombre AS seguidor_nombre 
           FROM comentarios c 
           JOIN usuarios u ON c.seguidor_id = u.id 
           WHERE c.post_id = $1 
           ORDER BY c.created_at ASC`,
          [post.id]
        );
        post.comentarios = commentsQuery.rows;
      }

      return res.json({ hasDonated: true, posts });
    }

    const donationCheck = await pool.query(
      "SELECT id FROM donaciones WHERE seguidor_id = $1 AND creador_id = $2 LIMIT 1",
      [userId, creadorId]
    );

    const hasDonated = donationCheck.rows.length > 0;

    if (!hasDonated) {
      const countQuery = await pool.query(
        "SELECT COUNT(*) FROM posts WHERE creador_id = $1",
        [creadorId]
      );

      return res.json({
        hasDonated: false,
        totalPosts: parseInt(countQuery.rows[0].count),
        message: "Debes donar al menos un flan para desbloquear las publicaciones de este creador.",
        posts: []
      });
    }

    const postsQuery = await pool.query(
      "SELECT * FROM posts WHERE creador_id = $1 ORDER BY created_at DESC",
      [creadorId]
    );

    return res.json({
      hasDonated: true,
      posts: postsQuery.rows
    });

  } catch (error) {
    console.error("Error al obtener publicaciones:", error);
    res.status(500).json({ message: "Error al obtener publicaciones" });
  }
};

const getFeed = async (req, res) => {
  try {
    const seguidorId = req.user.id;

    const query = `
      SELECT p.id, p.titulo, p.contenido, p.imagen, p.created_at, 
             u.id AS creador_id, u.nombre AS creador_nombre, u.foto_perfil AS creador_foto
      FROM posts p
      JOIN usuarios u ON p.creador_id = u.id
      WHERE p.creador_id IN (
        SELECT f.creador_id 
        FROM favoritos f
        WHERE f.seguidor_id = $1
      ) AND p.creador_id IN (
        SELECT DISTINCT d.creador_id 
        FROM donaciones d
        WHERE d.seguidor_id = $1
      )
      ORDER BY p.created_at DESC
    `;

    const result = await pool.query(query, [seguidorId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener feed:", error);
    res.status(500).json({ message: "Error al obtener el feed de publicaciones" });
  }
};

module.exports = {
  createPost,
  getPosts,
  getFeed
};