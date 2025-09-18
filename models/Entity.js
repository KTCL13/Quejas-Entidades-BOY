const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const Entity = sequelize.define('Complaint', {

  id: {
    type: DataTypes.BIGINT, 
    primaryKey: true,
    autoIncrement: true
  },
 
  name: {
    type: DataTypes.STRING, 
    allowNull: false 
  }
}, {

  tableName: 'entities', 
  timestamps: false 
});

module.exports = Entity;