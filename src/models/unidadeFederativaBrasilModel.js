const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize'); // Certifique-se de que este caminho está correto para sua instância do Sequelize

const UnidadeFederativaBrasil = sequelize.define('UnidadeFederativaBrasil', {
    sigla: {
        type: DataTypes.CHAR(2),
        primaryKey: true,
        field: 'sigla' // Nome da coluna no banco de dados
    },
    unidade_federativa: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
        field: 'unidade_federativa' // Nome da coluna no banco de dados
    },
    regiao: {
        type: DataTypes.STRING(45),
        field: 'regiao' // Nome da coluna no banco de dados
    }
}, {
    tableName: 'unidade_federativa_brasil', // Nome da tabela no banco de dados
    timestamps: false // Não gerencia createdAt e updatedAt
});

module.exports = UnidadeFederativaBrasil;