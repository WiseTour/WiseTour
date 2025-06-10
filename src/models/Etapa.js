const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sequelizeConfig");

const etapa = sequelize.define(
  "etapa",
  {
    id_etapa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    etapa: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
      validate: {
        isIn: [
          [
            "extracao",
            "tratamento",
            "transformacao",
            "carregamento",
            "conexao_s3",
            "finalizacao",
            "inicializacao",
          ],
        ],
      },
    },
  },
  {
    tableName: "etapa",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = etapa;
