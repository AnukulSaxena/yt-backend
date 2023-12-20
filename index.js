require('dotenv').config()
const express = require('express')


const app = express()
const port = process.env.PORT || 4000

app.get('/', (req, res) => {
    res.send("hello")
})

app.get('/twitter', (req, res) => {
    res.send('Twitter')
})

app.listen(port, () => {
    console.log("listening on " + port)
})