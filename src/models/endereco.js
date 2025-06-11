const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sequelizeConfig");

const endereco = sequelize.define(
  "endereco",
  {
    id_endereco: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    cep: {
      type: DataTypes.CHAR(8),
      allowNull: false,
    },
    tipo_logradouro: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    nome_logradouro: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    complemento: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    bairro: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    cidade: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    fk_uf_sigla: {
      type: DataTypes.CHAR(2),
      allowNull: false,
    },
  },
  {
    tableName: "endereco",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = endereco;
