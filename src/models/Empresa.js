const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/sequelizeConfig');

const Empresa = sequelize.define('empresa', {
  cnpj: {
    type: DataTypes.STRING(14),
    autoIncrement: true,
    primaryKey: true,
  },
  nome_fanatasia: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  razao_social: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  fk_informacao_contato_cadastro: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fk_endereco: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fk_uf_sigla: {
    type: DataTypes.CHAR(2),
    allowNull: false,
  },
});

module.exports = Empresa;
