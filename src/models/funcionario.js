const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sequelizeConfig");

const funcionario = sequelize.define(
  "funcionario",
  {
    id_funcionario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cargo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fk_cnpj: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fk_informacao_contato_cadastro: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fk_uf_sigla: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fk_endereco: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fk_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "funcionario",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = funcionario;
