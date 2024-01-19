import { Router } from "express";
import { getPaginateWatchedMovies, addWatchedMovie, deleteWatchedMovie, getWatchedMovies } from "../controllers/movie.controller.js";

const router = Router()

router.route("/watched/add").post(addWatchedMovie)
router.route("/watched/delete/:id/:user_id").delete(deleteWatchedMovie);
router.route("/watched/getall/:user_id").get(getWatchedMovies);
router.route("/watched/paginate/:user_id/:page/:pageSize").get(getPaginateWatchedMovies);

export default router