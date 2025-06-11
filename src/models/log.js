const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sequelizeConfig");

const log = sequelize.define(
  "log",
  {
    id_log: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fk_log_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fk_etapa: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fk_origem_dados: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fk_perfil_estimado_turistas: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fk_pais_origem: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fk_uf_entrada: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
    mensagem: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    erro: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    data_hora: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["id_log", "fk_log_categoria", "fk_etapa"],
      },
    ],
  },
  {
    tableName: "log",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = log;
