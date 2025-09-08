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
  }

}, {
  tableName: 'quejas',
  timestamps: false
});

module.exports = Queja;