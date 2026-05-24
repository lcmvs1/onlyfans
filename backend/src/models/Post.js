const { DataTypes } = require("sequelize");

const sequelize = require("../db/database");

const Post = sequelize.define("Post", {

    contenido: {

        type: DataTypes.TEXT,

        allowNull: false

    }

});

module.exports = Post;