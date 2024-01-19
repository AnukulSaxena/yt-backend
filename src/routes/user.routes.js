import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router()

function handleRoute() {

}


router.route("/register").post(handleRoute)

export default router