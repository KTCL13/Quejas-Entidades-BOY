const sequelize = require('../config/database');
const Entidad = require('./Entidad');
const Queja = require('./Queja');

Entidad.hasMany(Queja, {
  foreignKey: 'id_entidad' 
});

Queja.belongsTo(Entidad, {
  foreignKey: 'id_entidad'
});


module.exports = {
  sequelize,
  Entidad,
  Queja
};