'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association herew
      User.hasMany(models.Blog, { foreignKey: "authorId" });
      User.hasMany(models.Like, { foreignKey: "userId" });
    }
    
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    password: DataTypes.STRING,
    imgProfile: DataTypes.STRING,
    isVerify: DataTypes.BOOLEAN,
    verifyToken: DataTypes.STRING,
    verifyTokenCreatedAt: DataTypes.DATE,
    forgotToken: DataTypes.STRING,
    forgotTokenCreatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};