import cookieParser from 'cookie-parser';
import express from 'express'
import cors from 'cors'

const app = express()

const corsOptions = {
    origin: "*", // Allow requests from any origin
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


//routes import

import movieRouter from './routes/movie.routes.js'
import userRouter from './routes/user.routes.js';
import tvRouter from './routes/tv.routes.js'
import videoRouter from './routes/video.routes.js'
import commentRouter from './routes/comment.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import likeRouter from './routes/like.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
import playlistRouter from './routes/playlist.routes.js'
import healthcheckRouter from './routes/healthcheck.routes.js'
// movie routes declaration
//app.use("/api/v1/movie", movieRouter)
app.get('/', (req, res) => {
    res.send("hello")
})

// User routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/playlists", playlistRouter)
app.use("/api/v1/healthcheck", healthcheckRouter)


app.use("/api/v1/movie", movieRouter)
app.use("/api/v1/tv", tvRouter)

export { app }
