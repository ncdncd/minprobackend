'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Blog.belongsTo(models.User, 
        { foreignKey: "authorId"});
      Blog.hasMany(models.Like, { foreignKey: "blogId" });
    }
  }
  Blog.init({
    title: DataTypes.STRING,
    contentBlog: DataTypes.STRING,
    authorId: DataTypes.INTEGER,
    imgBlog: DataTypes.STRING,
    videoBlog: DataTypes.STRING,
    keywords: DataTypes.STRING,
    country: DataTypes.STRING,
    category: DataTypes.ENUM('Umum', 'Olahraga', 'Ekonomi', 'Politik', 'Bisnis', 'Fiksi')
  }, {
    sequelize,
    modelName: 'Blog',
  });
  return Blog;
};