const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/sequelizeConfig');

const TipoNotificacaoDados = sequelize.define('tipo_notificacao_dados', {
  fk_etapa: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  fk_configuracao_slack: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  fk_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
}, {
  timestamps: false,
});

module.exports = TipoNotificacaoDados;
