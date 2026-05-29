const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Repository = sequelize.define('Repository', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  developerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'developers',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: 'None'
  },
  stars: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  forks: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  watchers: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  size: {
    type: DataTypes.INTEGER,
    defaultValue: 0 // Size in KB
  },
  githubUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isFork: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'repositories',
  timestamps: true,
  indexes: [
    {
      fields: ['developerId']
    },
    {
      fields: ['language']
    }
  ]
});

module.exports = Repository;
