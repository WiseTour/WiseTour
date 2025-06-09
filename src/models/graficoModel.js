// src/models/graficoModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize'); // Caminho certo para a instância

const PerfilEstimadoTurista = sequelize.define('PerfilEstimadoTurista', {
    id_perfil_estimado_turistas: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Apenas este campo é AUTO_INCREMENT e a principal "ID"
        autoIncrement: true,
        allowNull: false
    },
    fk_pais_origem: {
        type: DataTypes.INTEGER,
        // REMOVA primaryKey: true AQUI, pois será definido no array abaixo
        allowNull: false
    },
    fk_uf_entrada: {
        type: DataTypes.STRING(2),
        // REMOVA primaryKey: true AQUI, pois será definido no array abaixo
        allowNull: false
    },
    ano: DataTypes.INTEGER,
    mes: DataTypes.INTEGER,
    quantidade_turistas: DataTypes.INTEGER,
    genero: DataTypes.STRING(45), // Ajustei para corresponder ao seu DB script
    faixa_etaria: DataTypes.STRING(45), // Ajustei para corresponder ao seu DB script
    via_acesso: DataTypes.STRING(45), // Ajustei para corresponder ao seu DB script
    composicao_grupo_familiar: DataTypes.STRING(45), // Ajustei para corresponder ao seu DB script
    fonte_informacao_viagem: DataTypes.STRING(45), // Ajustei para corresponder ao seu DB script
    servico_agencia_turismo: DataTypes.INTEGER, // Ajustei para INT conforme seu DB script
    motivo_viagem: DataTypes.STRING(45), // Ajustei para corresponder ao seu DB script
    motivacao_viagem_lazer: DataTypes.STRING(45), // Ajustei para corresponder ao seu DB script
    gasto_media_percapita_em_dolar: DataTypes.DOUBLE // Ajustei para DOUBLE conforme seu DB script
}, {
    tableName: 'perfil_estimado_turistas',
    timestamps: false,
    // DECLARE A CHAVE PRIMÁRIA COMPOSTA AQUI!
    primaryKey: ['id_perfil_estimado_turistas', 'fk_pais_origem', 'fk_uf_entrada']
});

module.exports = PerfilEstimadoTurista;