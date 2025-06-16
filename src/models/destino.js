const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sequelizeConfig");

const destino = sequelize.define(
  "destino",
  {
    fk_perfil_estimado_turistas: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "perfil_estimado_turistas",
        key: "id_perfil_estimado_turistas",
      },
    },
    fk_pais_origem: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "perfil_estimado_turistas",
        key: "fk_pais_origem",
      },
    },
    fk_uf_destino: {
      type: DataTypes.CHAR(2),
      primaryKey: true,
      allowNull: false,
      references: {
        model: "unidade_federativa_brasil",
        key: "sigla",
      },
    },
    fk_uf_entrada: {
      type: DataTypes.CHAR(2),
      primaryKey: true,
      allowNull: false,
      references: {
        model: "perfil_estimado_turistas",
        key: "fk_uf_entrada",
      },
    },
    permanencia_media: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  {
    tableName: "destino",
    timestamps: false,
    primaryKey: [
      "fk_perfil_estimado_turistas",
      "fk_pais_origem",
      "fk_uf_destino",
      "fk_uf_entrada",
    ],
  }
);

module.exports = destino;
