const { auth: authController } = require("../controllers");
const router = require("express").Router();
const validateMiddleware = require("../middleware/validation/auth")

router.post(
  "/register",
  validateMiddleware.validateRegister,
  authController.register
);

router.post(
  "/login",
  authController.login
);

router.patch(
  '/verify', 
  authController.verify
);

router.post(
  '/forgotPass',
  validateMiddleware.validateEmail,
  authController.forgot
);

router.post(
  '/resetPass', 
  validateMiddleware.validateResetPass,
  authController.reset
);

router.get("/");

module.exports = router;