const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sequelizeConfig");

const preferenciaVisualizacaoDashboard = sequelize.define(
  "preferencia_visualizacao_dashboard",
  {
    fk_tela_dashboard: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    fk_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
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
    tableName: "preferencia_visualizacao_dashboard",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = preferenciaVisualizacaoDashboard;
