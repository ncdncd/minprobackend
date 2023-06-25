const { blog: blogController } = require("../controllers");
const multerUpload = require("../middleware/multer");
const router = require("express").Router();
const authMiddleware = require("../middleware/auth")

// router.use(authMiddleware.verifyToken)

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkIsVerify,
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

router.get(
    '/mostFav',
    blogController.getMostFavorite
);


router.get(
    '/liked',
    authMiddleware.verifyToken,
    blogController.getLikedBlog
);

router.get(
    '/:id',
    blogController.singlePageBlog
);



router.post(
    '/like/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkIsVerify,
    blogController.likeBlog
);

router.patch(
    '/like/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkIsVerify,
    blogController.unlikeBlogPost

);

router.patch(
    '/remove/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkIsVerify,
    blogController.deleteBlogPost
);
  
router.get("/");
  
module.exports = router;