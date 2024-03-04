import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  updateUserValidator,
  userChangeCurrentPasswordValidator,
  userLoginValidator,
  userRegisterValidator,
} from "../validators/auth/user.validators.js";
import { validate } from "../validators/validate.js";
import { singleParamValidator } from "../validators/single/single.validators.js";
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
  userRegisterValidator(),
  validate,
  registerUser
);

router.route("/login").post(userLoginValidator, validate, loginUser);

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router
  .route("/change-password")
  .post(
    userChangeCurrentPasswordValidator(),
    validate,
    verifyJWT,
    changeCurrentPassword
  );
router.route("/current-user").get(verifyJWT, getCurrentUser);
router
  .route("/update-account")
  .patch(verifyJWT, updateUserValidator(), validate, updateAccountDetails);

router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/update-cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router
  .route("/channel/:username")
  .get(
    verifyJWT,
    singleParamValidator("username"),
    validate,
    getUserChannelProfile
  );
router.route("/watch-history").get(verifyJWT, getWatchHistory);

export default router;
