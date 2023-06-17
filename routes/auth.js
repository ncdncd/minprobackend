const { auth: authController } = require("../controllers");
const router = require("express").Router();

router.post(
  "/register",
  authController.register
);


router.get("/");

module.exports = router;