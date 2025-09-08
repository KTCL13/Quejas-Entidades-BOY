const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const Entidad = sequelize.define('Entidad', {

  id_entidad: {
    type: DataTypes.BIGINT, 
    primaryKey: true,
    autoIncrement: true
  },
 
  nombre_entidad: {
    type: DataTypes.STRING, 
    allowNull: false 
  }
}, {

  tableName: 'entidades', 
  timestamps: false 
});

module.exports = Entidad;