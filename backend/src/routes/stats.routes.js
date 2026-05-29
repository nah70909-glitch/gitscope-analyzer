const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');

// 1. Fetch top devs leaderboard
router.get('/top-developers', statsController.getTopDevelopers);

// 2. Fetch trending searches
router.get('/trending', statsController.getTrending);

// 3. Fetch overall system analytical aggregations
router.get('/stats/platform', statsController.getPlatformStats);

// 4. Query devs by language
router.get('/search', statsController.searchByLanguage);

module.exports = router;
