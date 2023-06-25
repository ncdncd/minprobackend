const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const db = require("../models");

module.exports = {

  async verifyToken(req, res, next) {

    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).send({
        message: "token is not found",
      });
      return;
    }

    const [format, token] = authorization.split(" ");
    if (format.toLocaleLowerCase() === "bearer") {
      try {
        const payload = jwt.verify(token, secretKey);
        if (!payload) {
          res.status(401).send({
            message: "token verification failed",
          });
          return;
        }
        req.user = payload;
        next();
      } catch (error) {
        res.status(401).send({
          message: "invalid token",
          error,
        });
      }
    }
  },

  async checkIsVerify(req, res, next) {
    
    const verified = await db.User.findOne({
        where: { id: req.user.id }
    })

    if (verified.dataValues.isVerify) {
      return next();
    }
    res.status(401).send({
      message: "your account is not verified",
    });
  },

}