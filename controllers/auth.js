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
        // check if verifytoken expired or not.
        const createdAt = new Date(userData.verifyTokenCreatedAt);
        const now = new Date();
        // set createdat to next 1 hour
        createdAt.setHours(createdAt.getHours() + 1);
        if (now > createdAt) {
          return res.status(400).send({
            message: "verify token is already expired",
          });
        }
  
        // save to db
        userData.isVerify = true;
        userData.verifyToken = null;
        userData.verifyTokenCreatedAt = null;
        await userData.save();
  
        res.send({
          message: "verification process is success",
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
              { username: user_identification },
            ],
          },
        });
        if (!user) {
          return res.status(400).send({
            message: "login failed, incorrect identity/password",
          });
        }
        if (user.isSuspended) {
          return res.status(400).send({
            message: "login failed, account suspended",
          });
        }
  
        // check password match with hash
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          user.loginTrialCount++;
          if (user.loginTrialCount >= 3) {
            user.isSuspended = true;
          }
          await user.save();
          return res.status(400).send({
            message: "login failed, incorrect identity/password",
          });
        }
  
        // reset counter login
        user.loginTrialCount = 0;
        await user.save();
        // generate token authorization
        const payload = { id: user.id, isAdmin: user.isAdmin };
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
}