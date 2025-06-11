const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sequelizeConfig");

const Funcionario = sequelize.define("funcionario", {
  id_funcionario: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  cargo: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  telefone: {
    type: DataTypes.STRING(11),
    allowNull: false,
  },
  fk_cnpj: {
    type: DataTypes.CHAR(14),
    allowNull: false,
  },
  fk_informacao_contato_cadastro: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fk_uf_sigla: {
    type: DataTypes.CHAR(2),
    allowNull: true,
  },
  fk_endereco: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fk_usuario: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'funcionario',
  timestamps: false,
});

module.exports = Funcionario;
