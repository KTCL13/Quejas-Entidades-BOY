// test/global-setup.js
const sequelize = require('../models').sequelize; // Asegúrate de que la ruta a tu instancia de sequelize sea correcta

module.exports = async () => {
  try {
    await sequelize.authenticate();
    console.log('Test database connection authenticated successfully.');
    // Usamos { force: true } para asegurarnos de que el esquema se recree desde cero
    await sequelize.sync({ force: true });
    console.log('Test database synchronized successfully.');
  } catch (error) {
    console.error('Error setting up the global test database:', error);
    process.exit(1);
  }
};
