const express = require('express');
const router = express.Router();
const developerRoutes = require('./developer.routes');
const statsRoutes = require('./stats.routes');

// Mount routes
router.use('/', developerRoutes);
router.use('/', statsRoutes);

module.exports = router;
