// 31-March-2021

// npm init -y
// npm install express mongodb cors body-parser nodemon dotenv
// npm install firebase-admin --save
// total 7 items 

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
//const serviceAccount = require("./private_key/==============.json");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is Running on port ==> ${port}`);
});

app.get('/', (req, res) => {
    res.send(`<h1>Development-Books-Corner's Server Is Running!...</h1>`);
})

// For FireBase Token System
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });


// ################################################################################
// ################################################################################
//                             MongoBD with Server - Start
// ################################################################################
// ################################################################################
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z9kin.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

    const booksCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_BOOKS}`);
    const orderCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_ORDER}`);

    //#################################################################
    //#################################################################
    // Read || GET operation ==> for Books

    app.get('/allBooks', (req, res) => {
        booksCollection.find({})
            .toArray((err, books) => {
                res.send(books);
                console.log("###############################");
                console.log(books);
            });
    });

    //#################################################################
    //#################################################################
    // Create || POST operation  ==> for Book

    app.post('/addBook', (req, res) => {
        const book = req.body;
        console.log(book);

        booksCollection.insertOne(book)
            .then(result => {
                // send to clint a true||false sms
                res.status(200).send(result.insertedCount > 0);
            })
    })

    //#################################################################
    //#################################################################
    // Delete || Delete operation  ==> for Books

    app.delete('/deleteBook/:id', (req, res) => {
        const bookId = req.params.id;
        console.log(bookId);

        booksCollection.deleteOne({ _id: ObjectID(bookId) })
            .then(result => {
                res.send(result.insertedCount);
                console.log(result.insertedCount);
            });
    });

    //#################################################################
    //#################################################################
    // Read || GET operation ==> for Order

    app.get('/orders', (req, res) => {

        booksCollection.find({})
            .toArray((err, books) => {
                res.send(books);
                console.log(books);
            });
    });


    console.log("DB connection ==> OK");
});
// ################################################################################
// ################################################################################
//                             MongoBD with Server - End
// ################################################################################
// ################################################################################
