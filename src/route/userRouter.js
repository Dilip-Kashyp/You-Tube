const Router = require("express");
const {
  userRegister,
  userLogin,
  logoutUser,
  refreshAccessToken,
  changePassword,
  updateCoverImage,
  getWatchHistory,
  getChannelProfile,
  updateAvatar,
  getCurrentUser,
  updateUserDetails,
} = require("../controller/userController.js");
const { upload } = require("../middleware/multer.js");
const { verifyJWT } = require("../middleware/auth.js");
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  userRegister
); //

router.route("/login").post(userLogin); //

router.route("/logout").post(verifyJWT, logoutUser); //
router.route("/refresh-token").post(refreshAccessToken); //
router.route("/change-password").post(verifyJWT, changePassword); //
router.route("/current-user").get(verifyJWT, getCurrentUser); //
router.route("/update-account").patch(verifyJWT, updateUserDetails); //

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar); //
router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("k"), updateCoverImage); //

router.route("/c/:username").get(verifyJWT, getChannelProfile); //
router.route("/history").get(verifyJWT, getWatchHistory); //

module.exports = router;
