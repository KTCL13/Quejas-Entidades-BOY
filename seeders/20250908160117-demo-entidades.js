'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('entities', [
      { name: 'Acueducto y Alcantarillado de Tunja' },
      { name: 'Veolia - Aseo' },
      { name: 'Empresa de Energía de Boyacá' },
      { name: 'Servicio de Gas Natural' }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('entities', null, {});
  }
};