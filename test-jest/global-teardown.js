// test/global-teardown.js
const sequelize = require('../models').sequelize; // Asegúrate de que la ruta sea correcta

module.exports = async () => {
  try {
    await sequelize.close();
    console.log('Test database connection closed successfully.');
  } catch (error) {
    console.error('Error closing the test database connection:', error);
    process.exit(1);
  }
};
