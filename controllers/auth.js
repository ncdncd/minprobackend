const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
const transporter = require("../helpers/transporter")

const { User } = db;

const secretKey = process.env.JWT_SECRET_KEY;

module.exports = {
    async register(req, res){
        const { username, email, phoneNumber, password, confirmPassword } =
        req.body;
        try {
            const isExist = await User.findOne({
              where: {
                [db.Sequelize.Op.or]: [{ username }, { email }, { phoneNumber }],
              },
            });
      
            if (isExist) {
              res.status(400).send({
                message: "username/email/phone number already registered",
              });
              return;
            }
      
            // generate password
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
      
            const newUser = await User.create({
              username,
              email,
              phoneNumber,
              password: hashPassword,
            });

            await transporter.sendMail({
                from: "the Blog",
                to: email,
                subject:"thank you for your registration",
                html:"<h1>THANK YOU<h1>",
            })
      
            res.status(201).send({
              message: "registration success",
              data: {
                username: newUser.username,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
              },
            });

          } catch (error) {
            res.status(500).send({
              message: "something wrong in the server",
              errors: error.message,
            });
        }
    },
    // async verify(req, res){
    //     try {
    //         const emailExist = await User.findOne({
    //           where: {
    //             id: req.user.id,
    //           },
    //         });
    //         res.send({ message: "account is now verified", data: user });
    //       } catch (error) {
    //         res.status(500).send({ message: "fatal error on server", error });
    //     }
    // },
}