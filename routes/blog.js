const { blog: blogController } = require("../controllers");
const multerUpload = require("../middleware/multer");
const router = require("express").Router();
const authMiddleware = require("../middleware/auth")

// router.use(authMiddleware.verifyToken)

router.post(
    '/',
    authMiddleware.verifyToken,
    multerUpload.single("file"),
    blogController.createBlogPost
);

router.get(
    '/',
    blogController.getBlog
);

router.get(
    '/myBlog',
    authMiddleware.verifyToken,
    blogController.getMyBlog
);

router.post(
    '/like/:id',
    authMiddleware.verifyToken,
    blogController.likeBlog
);
  
router.get("/");
  
module.exports = router;