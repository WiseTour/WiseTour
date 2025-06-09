const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize'); // caminho certo para a instância

const PerfilEstimadoTurista = sequelize.define('PerfilEstimadoTurista', {
  fk_pais_origem: DataTypes.INTEGER,
  fk_uf_entrada: DataTypes.STRING(2),
  ano: DataTypes.INTEGER,
  mes: DataTypes.INTEGER,
  quantidade_turistas: DataTypes.INTEGER,
  genero: DataTypes.STRING,
  faixa_etaria: DataTypes.STRING,
  via_acesso: DataTypes.STRING,
  composicao_grupo_familiar: DataTypes.STRING,
  fonte_informacao_viagem: DataTypes.STRING,
  servico_agencia_turismo: DataTypes.BOOLEAN,
  motivo_viagem: DataTypes.STRING,
  motivacao_viagem_lazer: DataTypes.STRING,
  gasto_media_percapita_em_reais: DataTypes.FLOAT
}, {
  tableName: 'perfil_estimado_turistas',
  timestamps: false
});

module.exports = PerfilEstimadoTurista;
