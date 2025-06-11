const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sequelizeConfig");

const informacaoContatoCadastro = sequelize.define(
  "informacao_contato_cadastro",
  {
    id_informacao_contato_cadastro: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { isEmail: true },
    },
    telefone: {
      type: DataTypes.STRING(11),
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fidelizado: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isIn: [["sim", "nao"]],
      },
    },
  },
  {
    tableName: "informacao_contato_cadastro",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = informacaoContatoCadastro;
