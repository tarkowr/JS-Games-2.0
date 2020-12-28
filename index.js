const cors = require('cors')
const compression = require('compression')
const bodyParser = require('body-parser')
const express = require('express')
let app = express()
const uuid = require('uuid')
const constants = require('./server/constants')

let admin = require("firebase-admin")
let serviceAccount = require("./.env/bloxii-firebase-adminsdk-u5uj7-d42053061c.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bloxii.firebaseio.com"
})
let db = admin.firestore()

app.use(bodyParser.urlencoded({  
    extended: true,
    keepExtensions: true  
}))
app.use(bodyParser.json())
app.use(compression())

// app.use(express.static(__dirname + '/dist'))
app.use(cors()) // REMOVE FOR PROD

// Get user from db by ID
app.get('/api/user/:id', async (req, res) => {
    const id = req.params.id

    if (!id) {
        res.status(500).send()
        return
    }

    let user = await db.collection(constants.firebaseCollections.users).doc(id).get()
        .catch((err) => {
            console.log(err)
            res.status(500).send()
            return
        })

    res.status(200).json(user.data())
})

// Insert new user into db
app.post('/api/user', async (req, res) => {
    const username = req.body.username
    const regex = /^[a-zA-Z0-9]{1,16}$/

    if (!regex.test(username)){
        res.status(500).send('Invalid username')
        return
    }
    
    const id = uuid.v4()
    const created = new Date()

    let user = {
        id: id,
        username: username,
        created: created
    }

    await db.collection(constants.firebaseCollections.users).doc(id).set(user)
        .catch((err) => {
            console.log(err)
            res.status(500).send()
            return
        })
    
    res.status(200).json(user)
})

// Get matching scores
app.get('/api/matching', async (req, res) => {
    let snapshot = await db.collection(constants.firebaseCollections.matching).get()
        .catch((err) => {
            console.log(err)
            res.status(500).send()
            return
        })
    
    let scores = []
    snapshot.forEach(doc => scores.push(doc.data()))
    
    res.status(200).json(scores)
})

// Save matching game score
app.post('/api/matching', async (req, res) => {
    const id = req.body.userId
    let score = req.body.score
    const date = new Date()
    const minScore = 10
    const maxScore = 100

    try {
        score = parseInt(score)
        if (isNaN(score)) throw new Error('Not number')
        if (score < minScore || score > maxScore) throw new Error('Invalid Value')
    } catch (e) {
        res.status(500).send(e)
        return
    }

    const scoreObj = {
        userId: id,
        score: score,
        date: date
    }

    await db.collection(constants.firebaseCollections.matching).add(scoreObj)
        .catch((err) => {
            console.log(err)
            res.status(500).send()
            return
        })

    res.status(200).send()
})

// Get flappy scores
app.get('/api/flappy', async (req, res) => {
    let snapshot = await db.collection(constants.firebaseCollections.flappy).get()
        .catch((err) => {
            console.log(err)
            res.status(500).send()
            return
        })

    let scores = []
    snapshot.forEach(doc => scores.push(doc.data()))
    
    res.status(200).json(scores)
})

// Save flappy score
app.post('/api/flappy', async (req, res) => {
    const id = req.body.userId
    const date = new Date()
    let score = req.body.score
    const maxScore = 999999

    try {
        score = parseInt(score)
        if (isNaN(score)) throw new Error('Not number')
    } catch (e) {
        res.status(500).send(e)
        return
    }

    if (score > maxScore) score = maxScore

    const scoreObj = {
        userId: id,
        score: score,
        date: date
    }

    await db.collection(constants.firebaseCollections.flappy).add(scoreObj)
        .catch((err) => {
            console.log(err)
            res.status(500).send()
            return
        })

    res.status(200).send()
})

// app.get('*', function(req, res) {
//     res.sendFile(path.join(__dirname + '/dist/index.html'))
// })

const PORT = process.env.PORT || 3200
app.listen(PORT, function(){
    console.log(`Listening on port ${PORT}`)
})
