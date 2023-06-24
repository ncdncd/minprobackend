const { body, validationResult } = require("express-validator");

const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

module.exports = {

  validateResetPass: validate([
    body("token").notEmpty().withMessage("token is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("minimum password length is 6 characters")
      .isStrongPassword({
        minNumbers: 0,
      })
      .withMessage(
        "password must contain atleast 1 uppercase letter and 1 symbol"
      )
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          return false;
        }
        return true;
      })
      .withMessage("confirm password is not match with password"),
  ]),

  validateChangePass: validate([
    body("password")
      .isLength({ min: 6 })
      .withMessage("minimum password length is 6 characters")
      .isStrongPassword({
        minNumbers: 0,
      })
      .withMessage(
        "password must contain atleast 1 uppercase letter and 1 symbol"
      )
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          return false;
        }
        return true;
      })
      .withMessage("confirm password does not match with password"),
  ]),
  
  validateRegister: validate([
    body("username")
      .notEmpty()
      .withMessage("username is required")
      .isLength({ max: 50 })
      .withMessage("Maximum character is 50"),
    body("email").isEmail(),
    body("phoneNumber").notEmpty(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("minimum password length is 6 characters")
      .isStrongPassword({
        minNumbers: 0,
      })
      .withMessage(
        "password must contain atleast 1 uppercase letter and 1 symbol"
      )
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          return false;
        }
        return true;
      })
      .withMessage("confirm password is not match with password"),
  ]),

  validateEmail: validate([
    body("email").isEmail()
    .withMessage(
      "email must be valid"
    ),
  ]),

  validateUsername: validate([
    body("username")
      .notEmpty()
      .withMessage("username is required")
      .isLength({ max: 50 })
      .withMessage("Maximum character is 50"),
  ]),

  validatePhone: validate([
    body("phone").notEmpty()
    .withMessage(
      "phone number must not be empty"
    ),
  ]),
};