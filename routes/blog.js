const { blog: blogController } = require("../controllers");
const multerUpload = require("../middleware/multer");
const router = require("express").Router();
const authMiddleware = require("../middleware/auth")

router.use(authMiddleware.verifyToken)
router.post(
    '/',
    multerUpload.single("file"),
    blogController.createBlogPost
);
  
router.get("/");
  
module.exports = router;