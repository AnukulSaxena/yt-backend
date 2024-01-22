import { Router } from "express";
import {  testWatchedTvShow, getPaginateWatchedTvShows, addWatchedTvShow, deleteWatchedTvShow, getWatchedTvShows } from "../controllers/tv.controller.js";

const router = Router()

router.route("/watched/add").post(addWatchedTvShow)
router.route("/watched/delete/:id/:user_id").delete(deleteWatchedTvShow);
router.route("/watched/getall/:user_id").get(getWatchedTvShows);
router.route("/watched/paginate/:user_id/:page/:pageSize").get(getPaginateWatchedTvShows);
router.route("/watched/test").post(testWatchedTvShow)

export default router