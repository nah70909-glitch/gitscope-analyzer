// Dynamically force SQLite mode for local validation checks
process.env.DB_DIALECT = 'sqlite';
process.env.DB_SQLITE_PATH = './database.test.sqlite';

const { verifyConnection, sequelize } = require('./config/database');
const { Developer, Repository, SearchHistory } = require('./models');
const logger = require('./utils/logger');
const fs = require('fs');
const path = require('path');

async function testDatabase() {
  try {
    logger.info('🧪 [Test DB] Starting database layer sanity checks...');
    
    // 1. Establish connection
    await verifyConnection();
    
    // 2. Sync schemas (forces recreate for testing cleanly)
    logger.info('[Test DB] Syncing schemas...');
    await sequelize.sync({ force: true });
    logger.success('[Test DB] Synced schemas cleanly.');

    // 3. Create test Developer record
    logger.info('[Test DB] Creating test developer: "testcoder"...');
    const dev = await Developer.create({
      username: 'testcoder',
      name: 'Test Coder Pro',
      avatarUrl: 'https://avatars.githubusercontent.com/u/999999?v=4',
      bio: 'Creating robust code systems.',
      followers: 120,
      following: 45,
      publicRepos: 12,
      totalStars: 250,
      totalForks: 80,
      accountAgeYears: 4.5,
      topLanguage: 'JavaScript',
      mostStarredRepo: 'antigravity-engine',
      developerScore: 65,
      developerRank: 'Elite Architect',
      githubCreatedAt: new Date('2021-10-10')
    });
    logger.success(`[Test DB] Created Developer with ID: ${dev.id}`);

    // 4. Create associated Repository records
    logger.info('[Test DB] Creating test repositories associated with "testcoder"...');
    const repo1 = await Repository.create({
      developerId: dev.id,
      name: 'antigravity-engine',
      description: 'Defying browser layout engines.',
      language: 'JavaScript',
      stars: 200,
      forks: 50,
      watchers: 200,
      size: 4500,
      githubUrl: 'https://github.com/testcoder/antigravity-engine',
      isFork: false
    });

    const repo2 = await Repository.create({
      developerId: dev.id,
      name: 'awesome-libraries',
      description: 'A curated list of awesome packages.',
      language: 'None',
      stars: 50,
      forks: 30,
      watchers: 50,
      size: 120,
      githubUrl: 'https://github.com/testcoder/awesome-libraries',
      isFork: false
    });
    logger.success(`[Test DB] Created Repositories: "${repo1.name}", "${repo2.name}"`);

    // 5. Create SearchHistory record
    logger.info('[Test DB] Recording search history...');
    const history = await SearchHistory.create({
      username: 'testcoder',
      searchCount: 1,
      lastSearchedAt: new Date()
    });
    logger.success(`[Test DB] Search history logged for "${history.username}"`);

    // 6. Query Developer and nested Repositories
    logger.info('[Test DB] Querying database for nested associations...');
    const queriedDev = await Developer.findOne({
      where: { username: 'testcoder' },
      include: [{ model: Repository, as: 'repositories' }]
    });

    logger.success(`[Test DB] Query successful! Found developer: ${queriedDev.name}`);
    logger.info(`👉 Top Language: ${queriedDev.topLanguage}`);
    logger.info(`👉 Developer Score: ${queriedDev.developerScore} / 100 (${queriedDev.developerRank})`);
    logger.info(`👉 Total Nested Repositories found: ${queriedDev.repositories.length}`);

    // 7. Verify Cascade Deletes
    logger.info('[Test DB] Verifying cascade deletion behavior by deleting Developer...');
    await queriedDev.destroy();
    
    const countDevs = await Developer.count({ where: { username: 'testcoder' } });
    const countRepos = await Repository.count({ where: { developerId: dev.id } });
    
    logger.success(`[Test DB] Deleted Developer count: ${countDevs} (Expected: 0)`);
    logger.success(`[Test DB] Cascaded Repository count: ${countRepos} (Expected: 0)`);

    if (countDevs === 0 && countRepos === 0) {
      logger.success('✅ [Test DB] DATABASE LAYER SANITY CHECK PASSED SUCCESSFULLY!');
    } else {
      logger.error('❌ [Test DB] Integrity validation failed! Deletion did not cascade properly.');
      process.exit(1);
    }
    
  } catch (error) {
    logger.error('❌ [Test DB] Database layer test failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    logger.info('[Test DB] Connection closed.');
    
    // Cleanup test database file
    try {
      const testDbPath = path.resolve(process.cwd(), './database.test.sqlite');
      if (fs.existsSync(testDbPath)) {
        fs.unlinkSync(testDbPath);
        logger.info('[Test DB] Cleaned up temporary test database file.');
      }
    } catch (cleanupErr) {
      logger.warn(`[Test DB] Could not delete temp test sqlite file: ${cleanupErr.message}`);
    }
  }
}

testDatabase();
