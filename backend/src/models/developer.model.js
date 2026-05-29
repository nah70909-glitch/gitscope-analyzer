const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Developer = sequelize.define('Developer', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  avatarUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  blog: {
    type: DataTypes.STRING,
    allowNull: true
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true
  },
  twitterUsername: {
    type: DataTypes.STRING,
    allowNull: true
  },
  followers: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  following: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  publicRepos: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalStars: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalForks: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  accountAgeYears: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0
  },
  topLanguage: {
    type: DataTypes.STRING,
    defaultValue: 'None'
  },
  mostStarredRepo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  developerScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  developerRank: {
    type: DataTypes.STRING,
    defaultValue: 'Code Novice'
  },
  githubCreatedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastAnalyzedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'developers',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['username']
    },
    {
      fields: ['developerScore']
    },
    {
      fields: ['topLanguage']
    }
  ]
});

module.exports = Developer;
