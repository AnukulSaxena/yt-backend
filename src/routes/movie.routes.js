import { Router } from "express";
import { getUnwatchedMovies } from "../controllers/movie.controller.js";

const router = Router()

router.route("/unwatched").post(getUnwatchedMovies)

export default router