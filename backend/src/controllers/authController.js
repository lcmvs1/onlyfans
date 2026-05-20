const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const register = async (req, res) => {

  try {

    const { nombre, email, password, rol } = req.body;

    const userExist = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (userExist.rows.length > 0) {
      return res.status(400).json({
        message: "El usuario ya existe"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `INSERT INTO usuarios(nombre, email, password, rol)
       VALUES($1, $2, $3, $4)
       RETURNING id, nombre, email, rol`,
      [nombre, email, hashedPassword, rol]
    );

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: newUser.rows[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error del servidor"
    });

  }

};

// =========================
// LOGIN
// =========================
const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    // Buscar usuario
    const user = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    // Verificar existencia
    if (user.rows.length === 0) {
      return res.status(400).json({
        message: "Usuario no encontrado"
      });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(400).json({
        message: "Contraseña incorrecta"
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.rows[0].id,
        rol: user.rows[0].rol
      },
      "secretkey",
      {
        expiresIn: "1d"
      }
    );

    // Respuesta
    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.rows[0].id,
        nombre: user.rows[0].nombre,
        email: user.rows[0].email,
        rol: user.rows[0].rol
      }
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error del servidor"
    });

  }

};

// =========================
// EXPORTAR
// =========================
module.exports = {
  register,
  login
};