const { Sequelize } = require('sequelize');
require('dotenv').config();

// Define las opciones de conexión base
const options = {
  dialect: 'postgres',
  logging: false,
};

// Lógica condicional para SSL en producción
if (process.env.NODE_ENV === 'production') {
  options.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

// Crea y EXPORTA la instancia, pero NO te conectes aquí
const sequelize = new Sequelize(process.env.DATABASE_URL, options);

module.exports = sequelize;
