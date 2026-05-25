const pool = require("../db/db");

const donateFlan = async (req, res) => {
  try {
    const seguidorId = req.user.id;
    const { creadorId, postId, cantidadFlanes } = req.body;

    if (!creadorId || !cantidadFlanes || cantidadFlanes <= 0) {
      return res.status(400).json({
        message: "Debe proporcionar creadorId y una cantidad de flanes válida (mayor a 0)."
      });
    }

    const creatorCheck = await pool.query(
      "SELECT nombre, rol FROM usuarios WHERE id = $1",
      [creadorId]
    );

    if (creatorCheck.rows.length === 0 || creatorCheck.rows[0].rol !== "creador") {
      return res.status(404).json({
        message: "El creador especificado no existe."
      });
    }

    let monto = 0;

    if (cantidadFlanes == 100) {

      monto = 2;

    }

    else if (cantidadFlanes == 500) {

      monto = 7;

    }

    else if (cantidadFlanes == 1000) {

      monto = 12;

    }

    await pool.query(

      `
      INSERT INTO desbloqueos(
        seguidor_id,
        post_id
      )
      VALUES($1,$2)

      ON CONFLICT
      DO NOTHING
      `,

      [seguidorId, postId]

    );
    const result = await pool.query(
      `INSERT INTO donaciones (seguidor_id, creador_id, cantidad_flanes, monto) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [seguidorId, creadorId, cantidadFlanes, monto]
    );

    res.status(201).json({
      message: `¡Gracias! Has donado ${cantidadFlanes} ${cantidadFlanes === 1 ? "flan" : "flanes"} (Bs. ${monto}) a ${creatorCheck.rows[0].nombre} con éxito.`,
      donation: result.rows[0]
    });
  } catch (error) {
    console.error("Error al procesar donación:", error);
    res.status(500).json({ message: "Error al procesar la donación" });
  }
};


const getDonationsHistory = async (req, res) => {
  try {
    const seguidorId = req.user.id;
    const { fechaInicio, fechaFin, creadorNombre } = req.query;

    let query = `
      SELECT d.id, d.cantidad_flanes, d.monto, d.created_at, u.nombre AS creador_nombre
      FROM donaciones d
      JOIN usuarios u ON d.creador_id = u.id
      WHERE d.seguidor_id = $1
    `;

    const params = [seguidorId];
    let paramCounter = 2;

    if (fechaInicio) {
      query += ` AND d.created_at >= $${paramCounter}::timestamp`;
      params.push(fechaInicio);
      paramCounter++;
    }

    if (fechaFin) {
      query += ` AND d.created_at <= ($${paramCounter}::text || ' 23:59:59')::timestamp`;
      params.push(fechaFin);
      paramCounter++;
    }

    if (creadorNombre) {
      query += ` AND u.nombre ILIKE $${paramCounter}`;
      params.push(`%${creadorNombre}%`);
      paramCounter++;
    }

    query += " ORDER BY d.created_at DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener historial de donaciones:", error);
    res.status(500).json({ message: "Error al obtener historial de donaciones" });
  }
};

module.exports = {
  donateFlan,
  getDonationsHistory
};
