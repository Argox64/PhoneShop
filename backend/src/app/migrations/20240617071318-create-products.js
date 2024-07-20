'use strict';

const { DataTypes, Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('Products', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        name: {
          type: Sequelize.STRING(200),
          allowNull: false
        },
        description: {
          type: Sequelize.TEXT
        },
        price: {
          type: Sequelize.DOUBLE(10, 2),
          allowNull: false
        },
      },
      { transaction }
    );
    await transaction.commit();
    } catch(err) {
      await transaction.rollback();
      throw err;
    }
  },
  async down(queryInterface) {
    try {
      const transaction = await queryInterface.sequelize.transaction();
      await queryInterface.dropTable('Products', transaction);
      transaction.commit();
    } catch(err) {
      await transaction.rollback();
      throw err;
    }
  }
};