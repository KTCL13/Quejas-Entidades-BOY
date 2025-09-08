'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('entidades', {
      id_entidad: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      nombre_entidad: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('entidades');
  }
};