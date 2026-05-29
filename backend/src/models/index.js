const { sequelize } = require('../config/database');
const Developer = require('./developer.model');
const Repository = require('./repository.model');
const SearchHistory = require('./searchHistory.model');

// Define relationships
Developer.hasMany(Repository, {
  foreignKey: 'developerId',
  as: 'repositories',
  onDelete: 'CASCADE'
});

Repository.belongsTo(Developer, {
  foreignKey: 'developerId',
  as: 'developer'
});

module.exports = {
  sequelize,
  Developer,
  Repository,
  SearchHistory
};
