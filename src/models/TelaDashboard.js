const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/sequelizeConfig');

const TelaDashboard = sequelize.define('tela_dashboard', {
  id_tela_dashboard: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fk_preferencias_visualizacao_dashboard: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fk_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tela: {
    type: DataTypes.STRING(13),
    allowNull: false,
    validate: {
      isIn: [['sazonalidade', 'perfilTurista', 'panoramaGeral']],
    },
  },
  ativo: {
    type: DataTypes.CHAR(3),
    allowNull: false,
    validate: {
      isIn: [['sim', 'nao']],
    },
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['id_tela_dashboard', 'fk_preferencias_visualizacao_dashboard', 'fk_usuario'],
    },
  ],
});

module.exports = TelaDashboard;
