import { Router } from "express";
import {
  singleBodyValidator,
  singleParamValidator,
} from "../validators/single/single.validators.js";
import { validate } from "../validators/validate.js";
import { mongoIdPathVariableValidator } from "../validators/common/mongodb.validators.js";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/").post(singleBodyValidator("content"), validate, createTweet);

router
  .route("/user/:userId")
  .get(mongoIdPathVariableValidator("userId"), validate, getUserTweets);

router
  .route("/:tweetId")
  .patch(
    mongoIdPathVariableValidator("tweetId"),
    singleBodyValidator("content"),
    validate,
    updateTweet
  )
  .delete(mongoIdPathVariableValidator("tweetId"), validate, deleteTweet);

export default router;
