const sequelize = require('../config/database');
const Entity= require('./Entity');
const Complaint = require('./Complaint');
const Comment = require('./Comment');

Entity.hasMany(Complaint, {

  foreignKey: 'entity_id' 
});

Complaint.belongsTo(Entity, {
  foreignKey: 'entity_id'

});

Complaint.hasMany(Comment, {
  foreignKey: 'complaint_id' 
});

Comment.belongsTo(Complaint, {
  foreignKey: 'complaint_id'
});

module.exports = {
  sequelize,
  Entity,
  Complaint,
  Comment
};