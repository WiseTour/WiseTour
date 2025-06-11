const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sequelizeConfig");

const usuario = sequelize.define(
  "usuario",
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    senha: {
      type: DataTypes.CHAR(12),
      allowNull: false,
    },
    permissao: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        isIn: [["admin", "padrao", "wisetour"]],
      },
    },
  },
  {
    tableName: "usuario",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = usuario;
