import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    getUserChannelSubscribersCount,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT);

router
    .route("/c/:channelId")
    .get(getUserChannelSubscribers)
    .post(toggleSubscription);

router
    .route('/c/check/:channelId')
    .get(getUserChannelSubscribersCount)

router.route("/u/").get(getSubscribedChannels);

export default router