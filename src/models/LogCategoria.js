const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/sequelizeConfig');

const LogCategoria = sequelize.define('log_categoria', {
  id_log_categoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  categoria: {
    type: DataTypes.STRING(45),
    allowNull: false,
    unique: true,
    validate: {
      isIn: [['erro', 'aviso', 'sucesso', 'info']],
    },
  },
});

module.exports = LogCategoria;
