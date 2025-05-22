const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelizeConfig');

const Funcionario = sequelize.define('Funcionario', {
  id_funcionario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  cargo: {
    type: DataTypes.STRING(70),
    allowNull: false
  },
  telefone: {
    type: DataTypes.STRING(11),
    allowNull: false
  },
  fk_cnpj: {
    type: DataTypes.CHAR(14),
    allowNull: false,
    references: {
      model: 'Empresa',
      key: 'cnpj'
    }
  },
  fk_informacao_contato_cadastro: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Informacao_Contato_Cadastro',
      key: 'id_informacao_contato_cadastro'
    }
  },
  fk_uf_sigla: {
    type: DataTypes.CHAR(2),
    allowNull: true,
    references: {
      model: 'Unidade_Federativa_Brasil',
      key: 'sigla'
    }
  }
}, {
  tableName: 'Funcionario',
  timestamps: false
});

module.exports = Funcionario;
