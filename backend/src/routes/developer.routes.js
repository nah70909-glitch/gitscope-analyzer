const express = require('express');
const router = express.Router();
const developerController = require('../controllers/developer.controller');
const { validateUsernameParam, validateIdParam } = require('../middleware/validator');
const { analysisLimiter } = require('../middleware/rateLimiter');

// 1. Analyze profile
router.get('/analyze/:username', validateUsernameParam, analysisLimiter, developerController.analyzeDeveloper);

// 2. List all analyzed profiles
router.get('/users', developerController.getDevelopers);

// 3. Get single profile detail by ID
router.get('/users/:id', validateIdParam, developerController.getDeveloperDetails);

// 4. Delete single profile by ID
router.delete('/users/:id', validateIdParam, developerController.deleteDeveloper);

module.exports = router;
