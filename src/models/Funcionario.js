const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sequelizeConfig");

const Funcionario = sequelize.define("funcionario", {
  id_funcionario: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  cargo: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  telefone: {
    type: DataTypes.STRING(11),
    allowNull: false,
  },
  fk_cnpj: {
    type: DataTypes.CHAR(14),
    primaryKey: true,
    allowNull: false,
  },
  fk_informacao_contato_cadastro: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  fk_uf_sigla: {
    type: DataTypes.CHAR(2),
    primaryKey: true,
    allowNull: true,
  },
  fk_endereco: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: true,
  },
  fk_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: true,
  },
});

module.exports = Funcionario;
