const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/sequelizeConfig');

const HistoricoContato = sequelize.define('historico_contato', {
  id_historico_contato: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fk_informacao_contato_cadastro: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  data_contato: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  anotacoes: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  responsavel: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
});

module.exports = HistoricoContato;
