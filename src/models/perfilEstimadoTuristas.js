const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sequelizeConfig");

const perfilEstimadoTuristas = sequelize.define(
  "perfil_estimado_turistas",
  {
    id_perfil_estimado_turistas: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    fk_pais_origem: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fk_uf_entrada: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    ano: DataTypes.INTEGER,
    mes: DataTypes.INTEGER,
    quantidade_turistas: DataTypes.INTEGER,
    genero: DataTypes.STRING(45),
    faixa_etaria: DataTypes.STRING(45),
    via_acesso: DataTypes.STRING(45),
    composicao_grupo_familiar: DataTypes.STRING(45),
    fonte_informacao_viagem: DataTypes.STRING(45),
    servico_agencia_turismo: DataTypes.INTEGER,
    motivo_viagem: DataTypes.STRING(45),
    motivacao_viagem_lazer: DataTypes.STRING(45),
    gasto_media_percapita_em_dolar: DataTypes.DOUBLE,
  },
  {
    tableName: "perfil_estimado_turistas",
    timestamps: false,
    freezeTableName: true,
    primaryKey: [
      "id_perfil_estimado_turistas",
      "fk_pais_origem",
      "fk_uf_entrada",
    ],
  }
);

module.exports = perfilEstimadoTuristas;
