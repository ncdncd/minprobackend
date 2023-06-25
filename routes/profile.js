const profileController = require("../controllers/profile");
const router = require("express").Router();
const authMiddleware = require("../middleware/auth")
const multerUploadP = require("../middleware/multerProf");
const validateMiddleware = require("../middleware/validation/auth")

router.use(authMiddleware.verifyToken)

router.patch(
    '/changePass',
    validateMiddleware.validateChangePass,
    profileController.updatePassword
);

router.patch(
    '/changeEmail',
    validateMiddleware.validateEmail,
    profileController.updateEmail
);

router.patch(
    '/changeUsername',
    validateMiddleware.validateUsername,
    profileController.updateUsername
);

router.patch(
    '/changePhone',
    validateMiddleware.validatePhone,
    profileController.updatePhone
);

router.patch(
    '/profilePhoto',
    multerUploadP.single("file"),
    profileController.updateProfilePhoto
);
  
router.get("/");
  
module.exports = router;