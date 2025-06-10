require("dotenv").config();
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    pool: {
      max: 10, // Máximo de 10 conexões no pool
      min: 2, // Mínimo de 2 conexões sempre ativas
      acquire: 60000, // Tempo limite para obter conexão (60 segundos)
      idle: 30000, // Tempo antes de fechar conexão inativa (30 segundos)
      evict: 60000, // Tempo para verificar conexões inválidas (60 segundos)
    },
    define: {
      freezeTableName: true, // Isso impede a pluralização automática
      // ou
      underscored: true,
    },

    // Outras configurações importantes
    dialectOptions: {
      connectTimeout: 60000, // Timeout de conexão MySQL
      // acquireTimeout e timeout não são válidos aqui para MySQL2
    },

    // Configurações de retry
    retry: {
      match: [
        /ETIMEDOUT/,
        /EHOSTUNREACH/,
        /ECONNRESET/,
        /ECONNREFUSED/,
        /TIMEOUT/,
        /ESOCKETTIMEDOUT/,
        /EHOSTUNREACH/,
        /EPIPE/,
        /EAI_AGAIN/,
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/,
      ],
      max: 3,
    },


    logging: (sql, timing) => {
      console.log('\n' + '='.repeat(150));
      console.log(`\n[${new Date().toISOString()}] SQL Query:`);
      console.log(sql);
      if (timing) console.log(`Execution time: ${timing}ms\n`);
      console.log('='.repeat(150) + '\n');
    },

  }
);

module.exports = {
  sequelize,
  Sequelize,
};