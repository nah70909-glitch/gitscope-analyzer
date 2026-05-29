const { sequelize, Developer, Repository, SearchHistory } = require('../models');
const { fetchUserProfile, fetchUserRepositories } = require('../services/github.service');
const { analyzeDeveloperData } = require('../services/analyzer.service');
const { success, error } = require('../utils/apiResponse');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

/**
 * Core Controller for Developer Operations
 */

/**
 * 1. Analyze and save a GitHub Developer
 */
async function analyzeDeveloper(req, res, next) {
  const { username } = req.params;
  const normalizedUsername = username.trim().toLowerCase();

  try {
    logger.info(`[Analyzer] Starting analysis for user: ${normalizedUsername}`);

    // Fetch from GitHub REST API (parallel requests)
    const [profileData, rawRepos] = await Promise.all([
      fetchUserProfile(normalizedUsername),
      fetchUserRepositories(normalizedUsername)
    ]);

    logger.info(`[Analyzer] Fetched GitHub data for ${normalizedUsername}. Repositories count: ${rawRepos.length}`);

    // Run Developer Intelligence Scoring engine
    const analysisResults = analyzeDeveloperData(profileData, rawRepos);

    // Save transaction to DB (Ensures database integrity)
    const result = await sequelize.transaction(async (t) => {
      // 1. Fetch developer if exists to retrieve active primary key ID
      let developer = await Developer.findOne({
        where: { username: normalizedUsername },
        transaction: t
      });

      let isNew = false;
      const devProfileData = {
        username: profileData.login.toLowerCase(),
        name: profileData.name || profileData.login,
        avatarUrl: profileData.avatar_url,
        bio: profileData.bio,
        location: profileData.location,
        blog: profileData.blog,
        company: profileData.company,
        twitterUsername: profileData.twitter_username,
        followers: profileData.followers || 0,
        following: profileData.following || 0,
        publicRepos: profileData.public_repos || 0,
        totalStars: analysisResults.totalStars,
        totalForks: analysisResults.totalForks,
        accountAgeYears: analysisResults.accountAgeYears,
        topLanguage: analysisResults.topLanguage,
        mostStarredRepo: analysisResults.mostStarredRepo,
        developerScore: analysisResults.developerScore,
        developerRank: analysisResults.developerRank,
        githubCreatedAt: analysisResults.githubCreatedAt,
        lastAnalyzedAt: new Date()
      };

      if (developer) {
        // Update existing Developer
        await developer.update(devProfileData, { transaction: t });
      } else {
        // Create new Developer (Guarantees primary key ID generation is returned)
        developer = await Developer.create(devProfileData, { transaction: t });
        isNew = true;
      }

      // 2. Refresh repositories (delete existing and bulk insert)
      await Repository.destroy({
        where: { developerId: developer.id },
        transaction: t
      });

      // Filter and prepare repositories insertion
      if (rawRepos && rawRepos.length > 0) {
        const reposToInsert = rawRepos.map(repo => ({
          developerId: developer.id,
          name: repo.name,
          description: repo.description,
          language: repo.language || 'None',
          stars: repo.stargazers_count || 0,
          forks: repo.forks_count || 0,
          watchers: repo.watchers_count || 0,
          size: repo.size || 0,
          githubUrl: repo.html_url,
          isFork: repo.fork || false
        }));

        await Repository.bulkCreate(reposToInsert, { transaction: t });
      }

      // 3. Upsert search history counters
      const [history, historyCreated] = await SearchHistory.findOrCreate({
        where: { username: normalizedUsername },
        defaults: { searchCount: 1, lastSearchedAt: new Date() },
        transaction: t
      });

      if (!historyCreated) {
        history.searchCount += 1;
        history.lastSearchedAt = new Date();
        await history.save({ transaction: t });
      }

      return {
        developer,
        isNew
      };
    });

    logger.success(`[Analyzer] Developer ${normalizedUsername} analyzed successfully! Score: ${analysisResults.developerScore}`);

    // Fetch complete object with repositories to return
    const completedProfile = await Developer.findOne({
      where: { id: result.developer.id },
      include: [{ model: Repository, as: 'repositories' }]
    });

    return success(res, `Developer '${normalizedUsername}' analyzed successfully`, completedProfile, result.isNew ? 201 : 200);

  } catch (err) {
    logger.error(`[Analyzer] Error analyzing developer ${normalizedUsername}:`, err);
    next(err);
  }
}

/**
 * 2. Get list of analyzed developers with advanced query filters, pagination and sorting
 */
async function getDevelopers(req, res, next) {
  try {
    let { 
      page = 1, 
      limit = 10, 
      sortBy = 'developerScore', 
      order = 'DESC', 
      search = '', 
      language = '' 
    } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    const offset = (page - 1) * limit;

    // Sorting fields validation
    const validSortFields = ['developerScore', 'totalStars', 'totalForks', 'followers', 'publicRepos', 'name', 'createdAt'];
    if (!validSortFields.includes(sortBy)) {
      sortBy = 'developerScore';
    }

    // Ordering validation
    order = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Filters formulation
    const whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { name: { [Op.like]: `%${search}%` } },
        { bio: { [Op.like]: `%${search}%` } }
      ];
    }

    if (language) {
      whereClause.topLanguage = {
        [Op.like]: `%${language}%`
      };
    }

    const { count, rows } = await Developer.findAndCountAll({
      where: whereClause,
      order: [[sortBy, order]],
      limit,
      offset
    });

    const totalPages = Math.ceil(count / limit);

    return success(res, 'Analyzed profiles fetched successfully', {
      profiles: rows,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
        limit
      }
    });

  } catch (err) {
    next(err);
  }
}

/**
 * 3. Fetch single profile details by ID
 */
async function getDeveloperDetails(req, res, next) {
  const { id } = req.params;

  try {
    const developer = await Developer.findOne({
      where: { id },
      include: [
        {
          model: Repository,
          as: 'repositories'
        }
      ]
    });

    if (!developer) {
      const err = new Error('Developer profile not found in database');
      err.status = 404;
      throw err;
    }

    return success(res, 'Developer details retrieved successfully', developer);

  } catch (err) {
    next(err);
  }
}

/**
 * 4. Delete single profile by ID
 */
async function deleteDeveloper(req, res, next) {
  const { id } = req.params;

  try {
    const developer = await Developer.findByPk(id);

    if (!developer) {
      const err = new Error('Developer profile not found in database');
      err.status = 404;
      throw err;
    }

    const username = developer.username;
    
    // Perform deletion
    await developer.destroy();

    logger.success(`[Database] Developer profile ${username} deleted.`);

    return success(res, `Developer profile '${username}' and associated repositories deleted successfully`, { id });

  } catch (err) {
    next(err);
  }
}

module.exports = {
  analyzeDeveloper,
  getDevelopers,
  getDeveloperDetails,
  deleteDeveloper
};
