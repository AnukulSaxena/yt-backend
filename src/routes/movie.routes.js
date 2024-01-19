import { Router } from "express";
import { addWatchedMovie, deleteWatchedMovie, getWatchedMovies } from "../controllers/movie.controller.js";

const router = Router()

router.route("/watched/add").post(addWatchedMovie)
router.route("/watched/delete/:id").delete(deleteWatchedMovie);
router.route("/watched/getall/:user_id").get(getWatchedMovies);



export default router