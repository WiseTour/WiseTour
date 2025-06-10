const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sequelizeConfig");

const tipoNotificacaoDados = sequelize.define(
  "tipo_notificacao_dados",
  {
    fk_etapa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    fk_configuracao_slack: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    fk_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    tableName: "tipo_notificacao_dados",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = tipoNotificacaoDados;
