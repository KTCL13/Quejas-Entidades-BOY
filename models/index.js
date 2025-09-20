const sequelize = require('../config/database');
const Entity= require('./Entity');
const Complaint = require('./Complaint');

Entity.hasMany(Complaint, {

  foreignKey: 'entity_id' 
});

Complaint.belongsTo(Entity, {
  foreignKey: 'entity_id'

});


module.exports = {
  sequelize,
  Entity,
  Complaint
};