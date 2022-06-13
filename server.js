const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

let connectionString = 'mongodb+srv://mongo:esterno7@cluster0.jkuqp.mongodb.net/?retryWrites=true&w=majority'
MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')

        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')

        app.listen(3000, function() {
            console.log("funcionando en ell 3000");
        })

        app.post('/quotes', (req, res) => { //CREATE
            quotesCollection.insertOne(req.body)
                .then(result => {
                    console.log(result)
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })
        app.get('/', (req, res) => { // READ 
            db.collection('quotes').find().toArray()
                .then(results => {
                    res.render('index.ejs', { quotes: results })
                })
                .catch( /* ... */ )
        })
    })
    //mongodb+srv://mongo:esterno7@cluster0.jkuqp.mongodb.net/?retryWrites=true&w=majority