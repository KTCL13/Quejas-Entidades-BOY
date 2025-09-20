const sequelize = require('../config/database');
const Entity= require('./Entity');
const Complaint = require('./Complaint');

Entity.hasMany(Complaint, {
  foreignKey: 'id_entidad' 
});

Complaint.belongsTo(Entity, {
  foreignKey: 'id_entidad'
});


module.exports = {
  sequelize,
  Entity,
  Complaint
};