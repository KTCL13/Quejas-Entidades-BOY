const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Complaint = sequelize.define('Complaint', {

s
  id: {

    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },


  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },


  is_deleted: {

    type: DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue:false
  }

}, {

  tableName: 'complaints',

  timestamps: false
});

module.exports = Complaint;