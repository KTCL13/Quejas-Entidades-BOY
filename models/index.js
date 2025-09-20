const sequelize = require('../config/database');
const Entity= require('./Entity');
const Queja = require('./Queja');

Entity.hasMany(Queja, {
  foreignKey: 'id_entidad' 
});

Queja.belongsTo(Entity, {
  foreignKey: 'id_entidad'
});


module.exports = {
  sequelize,
  Entity,
  Queja
};