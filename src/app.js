import cookieParser from 'cookie-parser';
import express from 'express'
import cors from 'cors'

const app = express()

const corsOptions = {
    origin: ['http://localhost:5173'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


//routes import

import userRouter from './routes/user.routes.js';
import videoRouter from './routes/video.routes.js'
import commentRouter from './routes/comment.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import likeRouter from './routes/like.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
import playlistRouter from './routes/playlist.routes.js'
import healthcheckRouter from './routes/healthcheck.routes.js'
import errorHandler from './middlewares/errorHandler.middleware.js';


// app.get('/', (req, res) => {
//     res.send('sdfskdj')
// })


// User routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/playlists", playlistRouter)
app.use("/api/v1/healthcheck", healthcheckRouter)

app.use(errorHandler);
export { app }
