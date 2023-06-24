const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
const transporter = require("../helpers/transporter")
const crypto = require("crypto")


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

            const verifyToken = crypto.randomBytes(16).toString("hex");
            const time = new Date();
      
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
      
            const newUser = await User.create({
              username,
              email,
              phoneNumber,
              password: hashPassword,
              verifyToken,
              verifyTokenCreatedAt: time
            });

            await transporter.sendMail({
                from: "the Blog",
                to: email,
                subject:"thank you for your registration",
                html:`<p>Click on this link to verify your email
                <a href='${process.env.BASEPATH}/verify?token=${verifyToken}' target="_blank">Verify Account</a></p>`,
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

    async verify(req, res) {
      const token = req.query.token;
      try {
        const userData = await db.User.findOne({
          where: {
            verifyToken: token,
          },
        });
        if (!userData) {
          return res.status(400).send({
            message: "verification token is invalid",
          });
        }
        if (userData.isVerified) {
          return res.status(400).send({
            message: "user already verified",
          });
        }
  

        userData.isVerify = true;
        userData.verifyToken = null;
        userData.verifyTokenCreatedAt = null;
        await userData.save();
  
        res.send({
          message: "verification process successful",
        });
      } catch (errors) {
        console.error(errors);
        res.status(500).send({
          message: "fatal error on server",
          error: errors.message,
        });
      }
    },

    async login(req, res) {
      const { user_identification, password } = req.body;
      try {
        const user = await User.findOne({
          where: {
            [db.Sequelize.Op.or]: [
              { email: user_identification },
              { phoneNumber: user_identification },
              { username: user_identification},
            ],
          },
        });
        if (!user) {
          return res.status(400).send({
            message: "login failed, incorrect identity/password",
          });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return res.status(400).send({
            message: "login failed, incorrect identity/password",
          });
        }


        const payload = { id: user.id };
        const token = jwt.sign(payload, secretKey, {
          expiresIn: "1h",
        });
        res.send({
          message: "login success",
          data: user,
          accessToken: token,
        });
      } catch (error) {
        res.status(500).send({
          message: "fatal error on server",
          error,
        });
      }
    },

    async forgot(req, res) {
      const { email } = req.body;
  
      try {
        const userData = await db.User.findOne({ where: { email } });
        if (!userData) {
          return res.status(500).send({
            message: "user is not found",
          });
        }
  
        // generate forgot token
        const forgotToken = crypto.randomBytes(16).toString("hex");
        const time = new Date();

        // send email
        await transporter.sendMail({
          from: "the Blog",
          to: email,
          subject: "Reset Password",
          html: `<p>Click on this link to reset your password
          <a href='${process.env.BASEPATH}/forgot?token=${forgotToken}' 
          target="_blank">reset password</a></p>`,
        });
  
        // save token to db
        userData.forgotToken = forgotToken;
        userData.forgotTokenCreatedAt = time;
        await userData.save();
  
        res.send({
          message: "please check your email!",
        });
      } catch (errors) {
        console.error(errors);
        res.status(500).send({
          message: "fatal error on server",
          error: errors.message,
        });
      }
    },
  
    async reset(req, res) {
      const { token, password } = req.body;
      try {
        const userData = await db.User.findOne({
          where: {
            forgotToken: token,
          },
        });
        if (!userData) {
          return res.status(400).send({ message: "token is not valid" });
        }
  
        // check token expiration
        const tokenCA = new Date(userData.forgotTokenCreatedAt);
        const now = new Date();
        tokenCA.setHours(tokenCA.getHours() + 1);
  
        if (now > tokenCA) {
          return res.status(400).send({
            message: "token is already expired",
          });
        }
  
        // generate password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
  
        userData.password = hashPassword;
        userData.forgotToken = null;
        userData.forgotTokenCreatedAt = null;
        await userData.save();
        res.send({
          message: "password is reset, try to login now!",
        });
      } catch (errors) {
        console.error(errors);
        res.status(500).send({
          message: "fatal error on server",
          error: errors.message,
        });
      }
    },
};