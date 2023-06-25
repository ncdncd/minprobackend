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
    // await queryInterface.addConstraint("Users", {
    //   type: "unique",
    //   fields: ["username", "email", "phoneNumber"],
    // });
    // await queryInterface.addConstraint("Users", {
    //   allowNull: false,
    //   fields: ["username", "email", "phoneNumber"],
    // });
    await queryInterface.addConstraint("Blogs", {
      fields: ["authorId"],
      type: "foreign key",
      name: "Blogs_1",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("Likes", {
      fields: ["userId"],
      type: "foreign key",
      name: "Likes_1",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("Likes", {
      fields: ["blogId"],
      type: "foreign key",
      name: "Likes_2",
      references: {
        table: "Blogs",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // await queryInterface.removeConstraint("Users", {
    //   type: "unique",
    //   fields: ["username", "email", "phoneNumber"],
    // });
    // await queryInterface.removeConstraint("Users", {
    //   allowNull: true,
    //   fields: ["username", "email", "phoneNumber"],
    // });
    // await queryInterface.removeConstraint("Blogs", "Blogs_1");
    // await queryInterface.removeConstraint("Likes", "Likes_1");
    // await queryInterface.removeConstraint("Likes", "Likes_2");
  }
};
