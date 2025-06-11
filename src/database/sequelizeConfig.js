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
      max: 10, 
      min: 2, 
      acquire: 60000, 
      idle: 30000,
      evict: 60000, 
    },
    define: {
      freezeTableName: true, 
      // ou
      underscored: true,
    },

    dialectOptions: {
      connectTimeout: 60000,
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