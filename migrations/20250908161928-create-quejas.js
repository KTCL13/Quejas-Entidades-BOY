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
      entity_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'entities',
          key: 'id'
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