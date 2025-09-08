'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('entidades', [
      { nombre_entidad: 'Acueducto y Alcantarillado de Tunja' },
      { nombre_entidad: 'Veolia - Aseo' },
      { nombre_entidad: 'Empresa de Energía de Boyacá' },
      { nombre_entidad: 'Servicio de Gas Natural' }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('entidades', null, {});
  }
};