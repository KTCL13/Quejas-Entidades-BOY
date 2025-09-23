'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('entities', [
      { name: 'Secretaría De Educación De Boyacá' },
      { name: 'Secretaría de Ambiente y Desarrollo Sostenible' },
      { name: 'Sistema de Atención al Ciudadano' },
      { name: 'Secretaría de Planeación' },
      { name: 'Secretaría de TIC y Gobierno Abierto' },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('entities', null, {});
  }
};