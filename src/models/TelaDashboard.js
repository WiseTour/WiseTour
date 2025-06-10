const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/sequelizeConfig');

const TelaDashboard = sequelize.define('tela_dashboard', {
  id_tela_dashboard: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tela: {
    type: DataTypes.STRING(13),
    allowNull: false,
    validate: {
      isIn: [['sazonalidade', 'perfilTurista', 'panoramaGeral']],
    },
  },
  
});

module.exports = TelaDashboard;
