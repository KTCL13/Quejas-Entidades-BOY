const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Queja = sequelize.define('Queja', {

  id_queja: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },

  descripcion_queja: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  isDeleted_queja: {
    type: DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue:false
  }

}, {
  tableName: 'quejas',
  timestamps: false
});

module.exports = Queja;