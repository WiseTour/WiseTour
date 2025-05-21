const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelizeConfig');
const Funcionario = require('./Funcionario');

const Usuario = sequelize.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fk_funcionario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Funcionario,
      key: 'id_funcionario'
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  senha: {
    type: DataTypes.CHAR(12),
    allowNull: false
  },
  permissao: {
    type: DataTypes.STRING(45),
    allowNull: false,
    validate: {
      isIn: [['Admin', 'Padrão']]
    }
  }
}, {
  tableName: 'Usuario',
  timestamps: false
});

// Associação (Usuário pertence a um Funcionário)
Usuario.belongsTo(Funcionario, {
  foreignKey: 'fk_funcionario',
  as: 'funcionario'
});

Funcionario.hasOne(Usuario, {
  foreignKey: 'fk_funcionario',
  as: 'usuario'
});

module.exports = Usuario;
