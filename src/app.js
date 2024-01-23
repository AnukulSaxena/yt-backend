import cookieParser from 'cookie-parser';
import express from 'express'
import cors from 'cors'

const app = express()

const corsOptions = {
    origin: process.env.CORS_ORIGIN, // Allow requests from any origin
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


// movie routes declaration
//app.use("/api/v1/movie", movieRouter)
 app.get('/', (req, res) => {
     res.send("hello")
 })

// User routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/movie", movieRouter)
app.use("/api/v1/tv", tvRouter)

export { app }