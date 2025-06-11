const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sequelizeConfig");

const logCategoria = sequelize.define(
  "log_categoria",
  {
    id_log_categoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    categoria: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
      validate: {
        isIn: [["erro", "aviso", "sucesso", "info"]],
      },
    },
  },
  {
    tableName: "log_categoria",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = logCategoria;
