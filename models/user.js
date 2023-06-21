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
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};