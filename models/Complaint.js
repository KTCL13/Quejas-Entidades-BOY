const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const COMPLAINT_STATES = require('../config/constants');

const Complaint = sequelize.define(
  'Complaint',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    state: {
      type: DataTypes.ENUM(Object.values(COMPLAINT_STATES)),
      allowNull: false,
      defaultValue: COMPLAINT_STATES.IN_PROGRESS,
    },

    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'complaints',

    timestamps: false,
  }
);

module.exports = Complaint;
