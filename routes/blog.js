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

router.get(
    '/mostFav',
    blogController.getMostFavorite
);

router.patch(
    '/remove/:id',
    authMiddleware.verifyToken,
    blogController.deleteBlogPost
);

router.get(
    '/:id',
    blogController.singlePageBlog
);

router.get(
    '/like',
    authMiddleware.verifyToken,
    blogController.getLikedBlog
);

router.post(
    '/like/:id',
    authMiddleware.verifyToken,
    blogController.likeBlog
);

router.patch(
    '/like/:id',
    authMiddleware.verifyToken,
    blogController.unlikeBlogPost
    
);


  
router.get("/");
  
module.exports = router;