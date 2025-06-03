const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/sequelizeConfig');

const PreferenciasVisualizacaoDashboard = sequelize.define('preferencias_visualizacao_dashboard', {
  id_preferencias_visualizacao_dashboard: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fk_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
      fields: ['id_preferencias_visualizacao_dashboard', 'fk_usuario'],
    },
  ],
});

module.exports = PreferenciasVisualizacaoDashboard;
