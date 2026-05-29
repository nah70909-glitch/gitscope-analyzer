const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const dialect = process.env.DB_DIALECT || 'mysql';
let sequelize;

if (dialect === 'sqlite') {
  const sqlitePath = process.env.DB_SQLITE_PATH || './database.sqlite';
  const absolutePath = path.resolve(process.cwd(), sqlitePath);
  console.log(`[Database] Initializing SQLite connection at: ${absolutePath}`);
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: absolutePath,
    logging: false
  });
} else {
  // MySQL connection parameters
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || 3306;
  const username = process.env.DB_USER || 'root';
  const password = process.env.DB_PASS || '';
  const database = process.env.DB_NAME || 'gitscope_db';

  console.log(`[Database] Initializing MySQL connection at: ${host}:${port}/${database}`);

  sequelize = new Sequelize(database, username, password, {
    host: host,
    port: port,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      connectTimeout: 5000 
    }
  });
}

// Verification function
async function verifyConnection() {
  try {
    await sequelize.authenticate();
    console.log(`[Database] ${dialect.toUpperCase()} connection established successfully!`);
  } catch (error) {
    console.error('❌ [Database Error] Connection failed!');
    console.error(`Detail: ${error.message}\n`);
    
    if (dialect === 'mysql') {
      console.warn('💡 [Developer Troubleshooting Guide]');
      console.warn('1. Make sure your local MySQL service is running.');
      console.warn('2. Check your backend/.env database credentials.');
      console.warn('3. Create the database "gitscope_db" manually if it does not exist: CREATE DATABASE gitscope_db;');
      console.warn('🔄 ZERO-CONFIG ALTERNATIVE:');
      console.warn('   You can run this entire platform using SQLite (no setup required!).');
      console.warn('   Just update backend/.env to: DB_DIALECT=sqlite\n');
    }
    throw error;
  }
}

module.exports = {
  sequelize,
  verifyConnection
};
