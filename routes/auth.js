const { auth: authController } = require("../controllers");
const router = require("express").Router();

router.post(
  "/register",
  authController.register
);

router.patch(
  '/verify', 
  authController.verify
);


router.get("/");

module.exports = router;