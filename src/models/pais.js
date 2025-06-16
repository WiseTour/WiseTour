const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sequelizeConfig");

const pais = sequelize.define(
  "pais",
  {
    id_pais: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id_pais",
    },
    pais: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: "pais",
    },
  },
  {
    tableName: "pais",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = pais;
