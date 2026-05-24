const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const donationRoutes = require("./routes/donationRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Servir archivos estáticos subidos (fotos de perfil, banners, posts)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Registrar rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/comments", commentRoutes);
app.use("/uploads", express.static("uploads"));

module.exports = app;