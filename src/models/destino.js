const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sequelizeConfig");

const destino = sequelize.define(
  "destino",
  {
    // 'destino' é o nome da sua tabela no banco de dados
    fk_perfil_estimado_turistas: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Parte da chave primária composta
      allowNull: false,
      // Referência para a primeira parte da PK composta de PerfilEstimadoTurista
      references: {
        model: "perfil_estimado_turistas",
        key: "id_perfil_estimado_turistas",
      },
    },
    fk_pais_origem: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Parte da chave primária composta
      allowNull: false,
      // Referência para a segunda parte da PK composta de PerfilEstimadoTurista
      references: {
        model: "perfil_estimado_turistas",
        key: "fk_pais_origem",
      },
    },
    fk_uf_destino: {
      type: DataTypes.CHAR(2), // CHAR(2) conforme seu schema
      primaryKey: true, // Parte da chave primária composta
      allowNull: false,
      references: {
        model: "unidade_federativa_brasil",
        key: "sigla",
      },
    },
    fk_uf_entrada: {
      type: DataTypes.CHAR(2), // CHAR(2) conforme seu schema
      primaryKey: true, // Parte da chave primária composta
      allowNull: false,
      // Referência para a terceira parte da PK composta de PerfilEstimadoTurista
      references: {
        model: "perfil_estimado_turistas",
        key: "fk_uf_entrada",
      },
    },
    permanencia_media: {
      type: DataTypes.DOUBLE, // Conforme seu schema
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
