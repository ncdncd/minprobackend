'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("Users", "forgotToken", {
      type: Sequelize.STRING(150),
      after: "verifyTokenCreatedAt",
      defaultValue: null,
      unique: true,
    });
    await queryInterface.addColumn("Users", "forgotTokenCreatedAt", {
      type: Sequelize.DATE,
      after: "forgotToken",
      defaultValue: null,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("Users", "forgotToken", {
    });
    await queryInterface.removeColumn("Users", "forgotTokenCreatedAt", {
    });
  }
};
