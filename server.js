const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express')
let app = express()
const cookieParser = require('cookie-parser')
const _ = require('underscore')
const uuid = require('uuid')

let admin = require("firebase-admin")
let serviceAccount = require("./.env/js-gms-firebase-adminsdk-fp7bn-957bd89151.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://js-gms.firebaseio.com"
})
let db = admin.firestore()

const usersCollection = 'users'
const scoresCollection = 'scores'
const scoresDocuments = {
    block: 'block',
    matching: 'matching'
}
const blockFields = {
    easy: 'easy',
    hard: 'hard',
    impossible: 'impossible',
    flappy: 'flappy'
}
const blockModes = [blockFields.easy, blockFields.hard, blockFields.impossible, blockFields.flappy]

app.use(bodyParser.urlencoded({  
    extended: true,
    keepExtensions: true  
}))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(express.static(__dirname + '/dist'))
app.use(cors()) // REMOVE FOR PROD

// Enforce max number of high scores with new result (order by high score)
function getTopHigh(scores, newScore, max){
    scores.push(newScore)

    let sorted = scores.sort((a, b) => {
        return b.score - a.score
    })
    
    while (sorted.length > max) {
        sorted.pop()
    }

    return sorted
}

// Enforce max number of high scores with new result (order by low score)
function getTopLow(scores, newScore, max){
    scores.push(newScore)

    let sorted = scores.sort((a, b) => {
        return a.score - b.score
    })

    while (sorted.length > max) {
        scores = sorted.pop()
    }

    return sorted
}

// Create new user in firebase
app.post('/user/create', (req, res) => {
    const username = req.body.username
    const regex = /^[a-zA-Z0-9]{1,12}$/

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

    // Add new user to firebase
    db.collection(usersCollection).doc(id).set(user)
        .then(() => {
            res.status(200).json(user)
        }).catch(err => {
            res.status(500).send(err)
        })
})

// Get user from firebase by ID
app.post('/user/get', (req, res) => {
    const id = req.body.id

    db.collection(usersCollection).doc(id).get()
    .then((doc) => {
        res.status(200).json(doc.data())
    })
    .catch((err) => {
        res.status(500).send(err)
    })
})

// Get user from firebase by ID
app.get('/user/get/all', (req, res) => {
    db.collection(usersCollection).get()
        .then((snapshot) => {
            let users = []

            snapshot.forEach(doc => {
                users.push(doc.data())
            })

            res.status(200).json(users)
        })
        .catch((err) => {
            res.status(500).send(err)
    })
})

// Get matching top scores
app.get('/game/matching', (req, res) => {
    db.collection(scoresCollection).doc(scoresDocuments.matching).get()
    .then((doc) => {
        res.status(200).json(doc.data().scores)
    })
    .catch(err => {
        res.status(500).send(err)
    })
})

// Handle matching game results
app.post('/game/matching/results', (req, res) => {
    const id = req.body.id
    let score = req.body.score
    const date = new Date()
    const max = 5
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

    // Get all scores
    db.collection(scoresCollection).doc(scoresDocuments.matching).get()
        .then((doc) => {
            let scores = doc.data().scores
            let topScores = getTopLow(_.clone(scores), scoreObj, max)

            // Check if scores have changed
            if (_.isEqual(scores, topScores)) {
                res.status(200).json('success')
                return
            }

            // Save updated scores to database
            db.collection(scoresCollection).doc(scoresDocuments.matching).set({
                scores: topScores
            }).then(() => {
                res.status(200).json('success')
            }).catch((err) => {
                res.status(500).send(err)
            })
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

// Get block top scores
app.get('/game/block', (req, res) => {
    db.collection(scoresCollection).doc(scoresDocuments.block).get()
    .then((doc) => {
        res.status(200).json(doc.data())
    })
    .catch(err => {
        res.status(500).send(err)
    })
})

// Handle block results
app.post('/game/block/results', (req, res) => {
    const id = req.body.userId
    const gameMode = req.body.gameMode
    const date = new Date()
    let score = req.body.score
    const max = 5
    const maxScore = 999999

    try {
        score = parseInt(score)
        if (isNaN(score)) throw new Error('Not number')
    } catch (e) {
        res.status(500).send(e)
        return
    }

    if (score > maxScore) score = maxScore

    if (!blockModes.includes(gameMode)) {
        res.status(500).send('Invalid gamemode')
        return
    }

    const scoreObj = {
        userId: id,
        score: score,
        date: date
    }

    // Get all scores
    db.collection(scoresCollection).doc(scoresDocuments.block).get()
        .then((scores) => {
            let blockScores = scores.data()[gameMode]
            let topScores = getTopHigh(_.clone(blockScores), scoreObj, max)

            // Check if scores have changed
            if (_.isEqual(blockScores, topScores)) {
                res.status(200).json('success')
                return
            }

            let update = {}
            update[gameMode] = topScores

            // Save updated scores to database
            db.collection(scoresCollection).doc(scoresDocuments.block).update(update)
                .then(() => {
                    res.status(200).json('success')
                }).catch((err) => {
                    res.status(500).send(err)
                })
        })
        .catch((err) => {
            console.log(err)
            res.status(500),send(err)
        })

})

const PORT = process.env.PORT || 3200
app.listen(PORT, function(){
    console.log(`Listening on port ${PORT}`)
})
