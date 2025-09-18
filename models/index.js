const sequelize = require('../config/database');
const Entity= require('./Entity');
const Queja = require('./Queja');

Entity.hasMany(Queja, {
  foreignKey: 'id' 
});

Queja.belongsTo(Entity, {
  foreignKey: 'entity_id'
});


module.exports = {
  sequelize,
  Entity,
  Queja
};