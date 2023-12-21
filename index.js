//require('dotenv').config()
import dotenv from 'dotenv'

import express from "express"
import cors from 'cors'
import connectDB from "./src/db/index.js";

dotenv.config({
    path: '.env'
})

//connectDB()


const app = express()

const corsOptions = {
    origin: '*', // Allow requests from any origin
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

const port = process.env.PORT || 4000
const gitData = {
    "login": "pocoCopo",
    "name": "Anukul Prakash Saxena"
}

app.get('/', (req, res) => {
    res.send("hello")
})

app.get('/api/github', (req, res) => {
    res.json(gitData)
})

app.listen(port, () => {
    console.log("listening on " + port)
})