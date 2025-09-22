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
  }

}, {

  tableName: 'comments',
  timestamps: true 
});

module.exports = Comment;