const db = require("../models");
const bcrypt = require("bcryptjs");
const transporter = require("../helpers/transporter");
const {
    setFromFileNameToDBValue,
    getFilenameFromDbValue,
    getAbsolutePathPublicFile,
  } = require("../utils/file");
const crypto = require("crypto");
const fs = require("fs");

module.exports = {
  
  async updatePassword(req, res) {
    const userId = req.user.id;
    const { currentPassword, password } = req.body;

    try {
      const userData = await db.User.findOne({ where: { id: userId } });

      const passCompare = await bcrypt.compare(currentPassword, userData.password )
      
      if (!passCompare) {
        return res.status(404).send({
            message: "current password does not match",
          });
      }
    
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

      if (password) {
        userData.password = hashPassword;
      }
      await userData.save();

      res.send({
        message: "successfully updated password",
      });
    } catch (error) {
      res.status(500).send({
        message: "fatal error on server",
        errors: error,
      });
    }
  },

  async updateUsername(req, res) {
    const userId = req.user.id;
    const { username } = req.body;

    try {
      const userData = await db.User.findOne({ where: { id: userId } });

      const isExist = await db.User.findOne({
        where: {
          username: username,
        },
      });

      if (isExist) {
        return res.status(400).send({
          message: "username already exist",
        });
      }

      if (username) {
        userData.username = username;
      }
      await userData.save();

      res.send({
        message: "successfully updated username",
        data: userData,
      });
    } catch (error) {
      res.status(500).send({
        message: "fatal error on server",
        errors: error,
      });
    }
  },

  async updateEmail(req, res) {
    const userId = req.user.id;
    const { email } = req.body;

    try {
      const userData = await db.User.findOne({ where: { id: userId } });

      const isExist = await db.User.findOne({
        where: {
          email: email,
        },
      });

      if (isExist) {
        return res.status(400).send({
          message: "email already exist",
        });
      }

      const verifyToken = crypto.randomBytes(16).toString("hex");

      if (email) {
        userData.email = email;
        userData.isVerify = false;
        userData.verifyToken = verifyToken;
      }
      await userData.save();

      await transporter.sendMail({
        from: "the Blog",
        to: email,
        subject:"verify new email",
        html:`<p>Click on this link to re-verify your email
        <a href='${process.env.BASEPATH}/verify?token=${verifyToken}' target="_blank">Verify your new email</a></p>`,
    })

      res.send({
        message: "successfuly updated email",
        data: userData,
      });
    } catch (error) {
      res.status(500).send({
        message: "fatal error on server",
        errors: error.message
      });
    }
  },

  async updatePhone(req, res) {
    const userId = req.user.id;
    const { phone } = req.body;

    try {
      const userData = await db.User.findOne({ where: { id: userId } });

      const isExist = await db.User.findOne({
        where: {
          phoneNumber: phone,
        },
      });

      if (isExist) {
        return res.status(400).send({
          message: "phone number already registered",
        });
      }

      if (phone) {
        userData.phoneNumber = phone;
      }
      await userData.save();

      res.send({
        message: "successfully updated phone number",
        data: userData,
      });
    } catch (error) {
      res.status(500).send({
        message: "fatal error on server",
        errors: error,
      });
    }
  },

  async updateProfilePhoto(req, res) {
    const userId = req.user.id;

    try {
      const userData = await db.User.findOne({ where: { id: userId } });

      if(req.file){
        if(userData.imgProfile !== null){
            const realimageURL = userData.getDataValue("imgProfile");
            const oldFilename = getFilenameFromDbValue(realimageURL);
            if (oldFilename) {
                fs.unlinkSync(getAbsolutePathPublicFile(oldFilename));
            }
        }
        userData.imgProfile = setFromFileNameToDBValue(req.file.filename);
      }

      await userData.save();

      res.send({
        message: "successfully uploaded picture",
        data: userData,
      });
    } catch (error) {
      res.status(500).send({
        message: "fatal error on server",
        errors: error,
      });
    }
  },

  
};
