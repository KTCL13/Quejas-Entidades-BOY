'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('quejas', {
      id_queja: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      descripcion_queja: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      isDeleted_queja: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      id_entidad: {
        type: Sequelize.BIGINT,
        references: {
          model: 'entidades',
          key: 'id_entidad'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('quejas');
  }
};