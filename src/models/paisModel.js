const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize'); // Certifique-se de que este caminho está correto para sua instância do Sequelize

const Pais = sequelize.define('Pais', {
    id_pais: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_pais' // Nome da coluna no banco de dados
    },
    pais: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        field: 'pais' // Nome da coluna no banco de dados
    }
}, {
    tableName: 'pais', // Nome da tabela no banco de dados
    timestamps: false // Não gerencia createdAt e updatedAt
});

module.exports = Pais;