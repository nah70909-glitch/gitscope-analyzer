require('dotenv').config();
const app = require('./app');
const { verifyConnection, sequelize } = require('./config/database');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    logger.info('🚀 [Server] Starting GitScope Analyzer Backend...');
    
    // 1. Establish Database Connection (MySQL or SQLite)
    await verifyConnection();

    // 2. Synchronize Sequelize Models (Generates tables dynamically if they do not exist)
    logger.info('[Database] Synchronizing schemas...');
    await sequelize.sync({ force: false }); 
    logger.success('[Database] Tables synchronized and verified successfully.');

    // 3. Fire up Express server
    app.listen(PORT, () => {
      logger.success(`🔥 [Server] GitScope Analyzer running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode!`);
      logger.info(`👉 Health check URL: http://localhost:${PORT}/health`);
      logger.info(`👉 Base API endpoint: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    logger.error('❌ [Server] Failed to initialize backend service:', error);
    process.exit(1);
  }
}

startServer();
