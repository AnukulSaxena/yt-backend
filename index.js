require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

const corsOptions = {
    origin: 'https://movietrakker.netlify.app/', // Allow requests from any origin
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Enable CORS for all routes
app.use(cors(corsOptions));



const port = process.env.PORT || 4000

const gitData = {
    "login": "AnukulSaxena",
    "id": 101214911,
    "node_id": "U_kgDOBghqvw",
    "avatar_url": "https://avatars.githubusercontent.com/u/101214911?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/AnukulSaxena",
    "html_url": "https://github.com/AnukulSaxena",
    "followers_url": "https://api.github.com/users/AnukulSaxena/followers",
    "following_url": "https://api.github.com/users/AnukulSaxena/following{/other_user}",
    "gists_url": "https://api.github.com/users/AnukulSaxena/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/AnukulSaxena/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/AnukulSaxena/subscriptions",
    "organizations_url": "https://api.github.com/users/AnukulSaxena/orgs",
    "repos_url": "https://api.github.com/users/AnukulSaxena/repos",
    "events_url": "https://api.github.com/users/AnukulSaxena/events{/privacy}",
    "received_events_url": "https://api.github.com/users/AnukulSaxena/received_events",
    "type": "User",
    "site_admin": false,
    "name": "Anukul Prakash Saxena",
    "company": null,
    "blog": "",
    "location": "Uttarakhand, India",
    "email": null,
    "hireable": null,
    "bio": "Why CS is so addictive... ",
    "twitter_username": null,
    "public_repos": 6,
    "public_gists": 0,
    "followers": 3,
    "following": 4,
    "created_at": "2022-03-08T19:51:33Z",
    "updated_at": "2023-12-10T13:29:06Z"
}

app.get('/', (req, res) => {
    res.send("hello")
})

app.get('/twitter', (req, res) => {
    res.send('Twitter')
})

app.get('/api/github', (req, res) => {
    res.json(gitData)
})

app.listen(port, () => {
    console.log("listening on " + port)
})