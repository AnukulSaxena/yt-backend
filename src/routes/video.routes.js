import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getAllVideosCount,
  getSubscriptionVideos,
  getVideoById,
  publishAVideo,
  testVideoController,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { publishVideoValidator } from "../validators/video/video.validators.js";
import { validate } from "../validators/validate.js";
import { mongoIdOptionalQueryValidator } from "../validators/common/mongodb.validators.js";
const router = Router();
router.use(verifyJWT);

router.route("/count").get(getAllVideosCount);
router
  .route("/")
  .get(mongoIdOptionalQueryValidator("userId"), validate, getAllVideos)
  .post(
    upload.fields([
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
      publishVideoValidator(),
      validate,
    ]),
    publishAVideo
  );

router
  .route("/:videoId")
  .get(getVideoById)
  .delete(deleteVideo)
  .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);
router.route("/test/:videoId").get(testVideoController);

router.route("/user/subscriptions").get(getSubscriptionVideos);

export default router;
