'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('Users', {
        uuid: {
          type: Sequelize.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        email: {
          type: Sequelize.STRING(100),
          unique: true,
          allowNull: false
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        role: {
          type: Sequelize.ENUM('admin', 'customer'),
          allowNull: false
        }
      },
      { transaction }
    );
    await transaction.commit();
    } catch(err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      const transaction = await queryInterface.sequelize.transaction();
      await queryInterface.dropTable('Users', transaction);
      transaction.commit();
    } catch(err) {
      await transaction.rollback();
      throw err;
    }
  }
};
