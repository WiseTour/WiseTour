const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sequelizeConfig");

const configuracaoSlack = sequelize.define(
  "configuracao_slack",
  {
    id_configuracao_slack: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fk_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    webhook_canal_padrao: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ativo: {
      type: DataTypes.CHAR(3),
      allowNull: false,
      validate: {
        isIn: [["sim", "nao"]],
      },
    },
  },
  {
    tableName: "configuracao_slack",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = configuracaoSlack;
