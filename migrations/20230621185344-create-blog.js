'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Blogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      contentBlog: {
        type: Sequelize.STRING
      },
      authorId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      imgBlog: {
        type: Sequelize.STRING
      },
      videoBlog: {
        type: Sequelize.STRING
      },
      keywords: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.ENUM('Umum', 'Olahraga', 'Ekonomi', 'Politik', 'Bisnis', 'Fiksi')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Blogs');
  }
};