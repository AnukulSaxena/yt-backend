import { Router } from "express";
import { validate } from "../validators/validate.js";
import { mongoIdPathVariableValidator } from "../validators/common/mongodb.validators.js";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  getUserChannelSubscribersCount,
  toggleSubscription,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router
  .route("/c/:channelId")
  .get(
    mongoIdPathVariableValidator("channelId"),
    validate,
    getUserChannelSubscribers
  )
  .post(
    mongoIdPathVariableValidator("channelId"),
    validate,
    toggleSubscription
  );

router
  .route("/c/check/:channelId")
  .get(
    mongoIdPathVariableValidator("channelId"),
    validate,
    getUserChannelSubscribersCount
  );

router.route("/u/").get(getSubscribedChannels);

export default router;
