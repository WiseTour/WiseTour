const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelizeConfig');
// const Funcionario = require('./Funcionario');

const Usuario = sequelize.define('usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
      isIn: [['admin', 'padrao']]
    }
  }
}, {
  tableName: 'usuario',
  timestamps: false
});

// Associação (Usuário pertence a um Funcionário)
/*Usuario.belongsTo(Funcionario, {
  foreignKey: 'fk_funcionario',
  as: 'funcionario'
});
*/

/*Funcionario.hasOne(Usuario, {
  foreignKey: 'fk_funcionario',
  as: 'usuario'
});

  fk_funcionario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Funcionario,
      key: 'id_funcionario'
    }
  },
*/

module.exports = Usuario;
