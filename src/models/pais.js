const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sequelizeConfig");

const pais = sequelize.define(
  "pais",
  {
    id_pais: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id_pais", // Nome da coluna no banco de dados
    },
    pais: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: "pais", // Nome da coluna no banco de dados
    },
  },
  {
    tableName: "pais",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = pais;
