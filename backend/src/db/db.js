const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "onlyflans",
  password: process.env.DB_PASSWORD || "root",
  port: process.env.DB_PORT || 5432,
});


// Función para inicializar las tablas de la base de datos automáticamente
const initDb = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log("Conectado a PostgreSQL. Inicializando tablas...");

    // Tabla de Usuarios
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        rol VARCHAR(50) NOT NULL CHECK (rol IN ('creador', 'seguidor')),
        foto_perfil VARCHAR(255) DEFAULT NULL,
        banner VARCHAR(255) DEFAULT NULL,
        meta_titulo VARCHAR(255) DEFAULT NULL,
        meta_descripcion TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de Posts
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        creador_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        titulo VARCHAR(255),
        contenido TEXT,
        imagen VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de Donaciones (Flanes)
    await client.query(`
      CREATE TABLE IF NOT EXISTS donaciones (
        id SERIAL PRIMARY KEY,
        seguidor_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        creador_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        cantidad_flanes INTEGER NOT NULL DEFAULT 1 CHECK (cantidad_flanes > 0),
        monto NUMERIC(10, 2) NOT NULL DEFAULT 10.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de Comentarios
    await client.query(`
      CREATE TABLE IF NOT EXISTS comentarios (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        seguidor_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        contenido TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de Favoritos
    await client.query(`
      CREATE TABLE IF NOT EXISTS favoritos (
        id SERIAL PRIMARY KEY,
        seguidor_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        creador_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_favorito UNIQUE (seguidor_id, creador_id)
      );
    `);

    console.log("Tablas e índices de base de datos verificados/creados correctamente.");
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error.message);
  } finally {
    if (client) {
      client.release();
    }
  }
};

// Iniciar base de datos
initDb();

module.exports = pool;
