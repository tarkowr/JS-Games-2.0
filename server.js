const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express')
const cookieParser = require('cookie-parser')
const cryptoJS = require('crypto-js')
var admin = require("firebase-admin")
const uuid = require('uuid')
let app = express()
let serviceAccount = require("./.env/js-gms-firebase-adminsdk-fp7bn-957bd89151.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://js-gms.firebaseio.com"
})
let db = admin.firestore()

const usersCollection = 'users'

app.use(bodyParser.urlencoded({  
    extended: false,
    keepExtensions: true  
}))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(express.static(__dirname + '/dist'))
app.use(cors()) // REMOVE FOR PROD

// Create new user in firebase
app.post('/user/create', (req, res) => {
    const username = req.body.username
    const regex = /^[a-zA-Z0-9]{1,12}$/

    if (!regex.test(username)){
        res.status(400).send('Invalid username')
        return
    }
    
    const id = uuid.v4()
    const created = new Date()

    let user = {
        id: id,
        username: username,
        created: created
    }

    db.collection(usersCollection).doc(id).set(user)
    .then(() => {
        res.status(200).json(user)
    }).catch(err => {
        res.status(500).send(err)
    })
})

// Get user from firebase by ID
app.post('/user/get', async (req, res) => {
    const id = req.body.id

    db.collection(usersCollection).doc(id).get()
    .then((doc) => {
        res.status(200).json(doc.data())
    })
    .catch((err) => {
        res.status(500).send(err)
    })
})

const PORT = process.env.PORT || 3200
app.listen(PORT, function(){
    console.log(`Listening on port ${PORT}`)
})
