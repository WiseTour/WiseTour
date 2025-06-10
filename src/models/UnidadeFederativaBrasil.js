const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sequelizeConfig");

const unidadeFederativaBrasil = sequelize.define(
  "unidade_federativa_brasil",
  {
    sigla: {
      type: DataTypes.CHAR(2),
      primaryKey: true,
      allowNull: false,
    },
    unidade_federativa: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },
    regiao: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
  },
  {
    tableName: "unidade_federativa_brasil",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = unidadeFederativaBrasil;
