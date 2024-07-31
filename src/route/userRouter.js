const Router = require("express");
const {
  userRegister,
  userLogin,
  logoutUser,
  refreshAccessToken,
  changePassword,
  updateUserDetails,
  updateAvatar,
  updateCoverImage,
  getChannelProfile,
} = require("../controller/userRegister.js");
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
);

router.route("/login").post(userLogin);

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(changePassword);
router.route("/current-user").get(getCurrentUser);
router.route("/update-user-details").patch(updateUserDetails);
router.route("/update-avatar").patch(updateAvatar);
router.route("/update-cover-image").patch(updateCoverImage);
router.route("/channel-profile").patch(getChannelProfile);

module.exports = router;
