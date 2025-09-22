const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const Comment = sequelize.define('Comment', {

  id: {
    type: DataTypes.BIGINT, 
    primaryKey: true,
    autoIncrement: true
  },

  message: {
    type: DataTypes.STRING,
    allowNull: false
  },

  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },

}, {
  tableName: 'comments',
  timestamps: false 
});

module.exports = Comment;