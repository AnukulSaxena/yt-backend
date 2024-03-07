import { Router } from "express";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  playlistBodyValidator,
  playlistPathVariableValidator,
} from "../validators/playlist/playlist.validators.js";
import { mongoIdPathVariableValidator } from "../validators/common/mongodb.validators.js";
import { validate } from "../validators/validate.js";
const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(playlistBodyValidator(), validate, createPlaylist);

router
  .route("/:playlistId")
  .get(mongoIdPathVariableValidator("playlistId"), validate, getPlaylistById)
  .patch(
    mongoIdPathVariableValidator("playlistId"),
    playlistBodyValidator(),
    validate,
    updatePlaylist
  )
  .delete(
    mongoIdPathVariableValidator("playlist Id"),
    validate,
    deletePlaylist
  );

router
  .route("/add/:videoId/:playlistId")
  .patch(playlistPathVariableValidator(), validate, addVideoToPlaylist);
router
  .route("/remove/:videoId/:playlistId")
  .patch(playlistPathVariableValidator(), validate, removeVideoFromPlaylist);

router
  .route("/user/:userId")
  .get(mongoIdPathVariableValidator("userId"), validate, getUserPlaylists);

export default router;
