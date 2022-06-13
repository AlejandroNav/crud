const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
    // ========================
    // Middlewares
    // ========================
app.set('view engine', 'ejs') // so we can creat html with ejs
app.use(bodyParser.urlencoded({ extended: true })) // parsing middleware. takes data from the form and and adds the to the body
app.use(bodyParser.json()) // makes the objects we send from the backend to the server a JSON   
app.use(express.static('public')) // makes that express can read the folder with the main js and css

let connectionString = 'mongodb+srv://mongo:esterno7@cluster0.jkuqp.mongodb.net/?retryWrites=true&w=majority'
MongoClient.connect(connectionString, { useUnifiedTopology: true }) // conection to the srver
    .then(client => {
        console.log('Connected to Database')

        const db = client.db('star-wars-quotes') //naming our database
        const quotesCollection = db.collection('quotes') // naming our collection for this program
            // ========================
            // Routes
            // ========================
        app.listen(3000, function() {
            console.log("funcionando en ell 3000");
        })

        app.post('/quotes', (req, res) => { //CREATE
            quotesCollection.insertOne(req.body)
                .then(result => {
                    console.log(result)
                    res.redirect('/') // refresshes the page after inserting is finisehd
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
        app.put('/quotes', (req, res) => {
            console.log(req.body)
            quotesCollection.findOneAndUpdate({ name: 'yoda' }, {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                }, {
                    upsert: true
                })
                .then(result => {
                    console.log(result);
                    res.json('Success');
                })
                .catch(error => console.error(error))
        })
        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne({ name: req.body.name })
                .then(result => {
                    if (result.deletedCount === 0) {
                        return res.json('No quote to delete')
                    }
                    res.json('Deleted Darth Vadar\'s quote')
                })
                .catch(error => console.error(error))
        })

    })
    //mongodb+srv://mongo:esterno7@cluster0.jkuqp.mongodb.net/?retryWrites=true&w=majority