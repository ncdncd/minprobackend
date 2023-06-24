const { auth: authController } = require("../controllers");
const authValidator = require("../middleware/validation/auth");
const router = require("express").Router();

router.post(
  "/register",
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
  authController.forgot
);

router.post(
  '/resetPass', 
  authValidator.validateResetPass,
  authController.reset
);

router.get("/");

module.exports = router;