const pool = require("../db/db");

const createComment = async (req, res) => {
  try {
    const seguidorId = req.user.id;
    const { postId, contenido } = req.body;

    if (!postId || !contenido || contenido.trim() === "") {
      return res.status(400).json({ message: "postId y contenido son obligatorios." });
    }

    const postQuery = await pool.query(
      "SELECT creador_id FROM posts WHERE id = $1",
      [postId]
    );

    if (postQuery.rows.length === 0) {
      return res.status(404).json({ message: "La publicación especificada no existe." });
    }

    const creadorId = postQuery.rows[0].creador_id;

    const donationCheck = await pool.query(
      "SELECT id FROM donaciones WHERE seguidor_id = $1 AND creador_id = $2 LIMIT 1",
      [seguidorId, creadorId]
    );

    if (donationCheck.rows.length === 0) {
      return res.status(403).json({
        message: "No puedes comentar en una publicación antes de haberle donado al menos un flan a este creador."
      });
    }

    const result = await pool.query(
      `INSERT INTO comentarios (post_id, seguidor_id, contenido) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [postId, seguidorId, contenido]
    );

    res.status(201).json({
      message: "Comentario publicado exitosamente.",
      comment: result.rows[0]
    });
  } catch (error) {
    console.error("Error al crear comentario:", error);
    res.status(500).json({ message: "Error al publicar comentario" });
  }
};

module.exports = {
  createComment
};
