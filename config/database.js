const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});


sequelize.authenticate()
  .then(() => console.log('Conexión a DB establecida con Sequelize.'))
  .catch(err => console.error('No se pudo conectar a DB:', err));

module.exports = sequelize;