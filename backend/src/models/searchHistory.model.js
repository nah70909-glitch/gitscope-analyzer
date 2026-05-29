const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SearchHistory = sequelize.define('SearchHistory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  searchCount: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  lastSearchedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'search_histories',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['username']
    },
    {
      fields: ['lastSearchedAt']
    }
  ]
});

module.exports = SearchHistory;
