import { Router } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { mongoIdPathVariableValidator } from "../validators/common/mongodb.validators.js";
import { validate } from "../validators/validate.js";
import { singleBodyValidator } from "../validators/single/single.validators.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/:videoId")
  .get(mongoIdPathVariableValidator("videoId"), validate, getVideoComments)
  .post(
    mongoIdPathVariableValidator("videoId"),
    singleBodyValidator("content"),
    validate,
    addComment
  );
router
  .route("/c/:commentId")
  .delete(mongoIdPathVariableValidator("commentId"), validate, deleteComment)
  .patch(
    mongoIdPathVariableValidator("commentId"),
    singleBodyValidator("content"),
    validate,
    updateComment
  );

export default router;
