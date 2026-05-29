const { Developer, Repository, SearchHistory } = require('../models');
const { success } = require('../utils/apiResponse');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

/**
 * Controller for Aggregated Stats & Analytics APIs
 */

/**
 * 1. Fetch overall platform-wide aggregates and distributions
 */
async function getPlatformStats(req, res, next) {
  try {
    // A. Count totals
    const developerCount = await Developer.count();
    const repositoryCount = await Repository.count();

    // B. Calculate averages & sums (using safe fallbacks for empty databases)
    const metrics = await Developer.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('developerScore')), 'avgScore'],
        [sequelize.fn('SUM', sequelize.col('totalStars')), 'totalStars'],
        [sequelize.fn('SUM', sequelize.col('totalForks')), 'totalForks'],
        [sequelize.fn('AVG', sequelize.col('accountAgeYears')), 'avgAge']
      ],
      raw: true
    });

    const avgScore = metrics && metrics.avgScore ? Math.round(parseFloat(metrics.avgScore) * 10) / 10 : 0;
    const totalStars = metrics && metrics.totalStars ? parseInt(metrics.totalStars, 10) : 0;
    const totalForks = metrics && metrics.totalForks ? parseInt(metrics.totalForks, 10) : 0;
    const avgAge = metrics && metrics.avgAge ? Math.round(parseFloat(metrics.avgAge) * 10) / 10 : 0;

    // C. Language Distribution (count by Developers top language)
    const langDistribution = await Developer.findAll({
      attributes: [
        'topLanguage',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['topLanguage'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      limit: 10,
      raw: true
    });

    // D. Rank Distribution counts (for charts)
    const ranks = ['10x Mythic Developer', 'Elite Architect', 'Rising Tech Lead', 'Scrappy Builder', 'Code Novice'];
    const rankCounts = await Promise.all(
      ranks.map(async (rank) => {
        const count = await Developer.count({ where: { developerRank: rank } });
        return { rank, count };
      })
    );

    return success(res, 'Platform metrics aggregated successfully', {
      totals: {
        developers: developerCount,
        repositories: repositoryCount,
        stars: totalStars,
        forks: totalForks
      },
      averages: {
        score: avgScore,
        ageYears: avgAge
      },
      distributions: {
        languages: langDistribution.map(l => ({
          language: l.topLanguage,
          count: parseInt(l.count, 10)
        })),
        ranks: rankCounts
      }
    });

  } catch (err) {
    next(err);
  }
}

/**
 * 2. Get top 10 developers by score (Leaderboard)
 */
async function getTopDevelopers(req, res, next) {
  try {
    const developers = await Developer.findAll({
      order: [['developerScore', 'DESC']],
      limit: 10
    });

    return success(res, 'Top developers retrieved successfully', developers);
  } catch (err) {
    next(err);
  }
}

/**
 * 3. Get trending / recently analyzed developer profiles
 */
async function getTrending(req, res, next) {
  try {
    // Query recently searched records in SearchHistory
    const searchHistory = await SearchHistory.findAll({
      order: [['lastSearchedAt', 'DESC']],
      limit: 6,
      raw: true
    });

    if (searchHistory.length === 0) {
      return success(res, 'Trending list retrieved successfully', []);
    }

    const usernames = searchHistory.map(h => h.username);

    // Fetch full profiles of these users
    const developers = await Developer.findAll({
      where: {
        username: {
          [Op.in]: usernames
        }
      }
    });

    // Sort developers in the original order of the searchHistory (most recent first)
    const sortedDevs = searchHistory
      .map(historyItem => developers.find(d => d.username === historyItem.username))
      .filter(Boolean); // removes any undefined elements in case searchHistory and Developer are out of sync

    return success(res, 'Trending list retrieved successfully', sortedDevs);

  } catch (err) {
    next(err);
  }
}

/**
 * 4. Search and filter developers by top programming language
 */
async function searchByLanguage(req, res, next) {
  const { language } = req.query;

  try {
    if (!language) {
      return success(res, 'Language parameter missing', []);
    }

    const developers = await Developer.findAll({
      where: {
        topLanguage: {
          [Op.like]: `%${language.trim()}%`
        }
      },
      order: [['developerScore', 'DESC']]
    });

    return success(res, `Developers matching language '${language}' retrieved successfully`, developers);

  } catch (err) {
    next(err);
  }
}

module.exports = {
  getPlatformStats,
  getTopDevelopers,
  getTrending,
  searchByLanguage
};
