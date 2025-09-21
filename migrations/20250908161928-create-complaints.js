'use strict';

const COMPLAINT_STATES= require('../config/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('complaints', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      state: {
        type: Sequelize.ENUM(...Object.values(COMPLAINT_STATES)),
        allowNull: false,
        defaultValue: COMPLAINT_STATES.IN_PROGRESS
      },

      is_deleted: {
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
    await queryInterface.dropTable('complaints');
  }
};