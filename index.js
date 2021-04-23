// 31-March-2021

// npm init -y
// npm install express mongodb cors body-parser nodemon dotenv
// npm install firebase-admin --save
// total 7 items 

// "start": "node index.js",
// "start:dev": "nodemon index.js",


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

app.set('title', 'Books-Corner ==> Server');

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


    // Read || GET operation ==> for Books
    //#################################################################
    app.get('/allBooks', (req, res) => {
        booksCollection.find({})
            .toArray((err, books) => {
                res.send(books);
                console.log("###############################");
                console.log(books);
            });
    });



    // Create || POST operation  ==> for Book
    //#################################################################
    app.post('/addBook', (req, res) => {
        const book = req.body;
        console.log(book);

        booksCollection.insertOne(book)
            .then(result => {
                // send to clint a true||false sms
                res.status(200).send(result.insertedCount > 0);
            })
    })



    // Delete || Delete operation  ==> for Books
    //#################################################################
    app.delete('/deleteBook/:id', (req, res) => {
        const bookId = req.params.id;
        console.log(bookId);

        //res.send(true);
        booksCollection.deleteOne({ _id: ObjectID(bookId) })
            .then(result => {
                res.send(result.deletedCount > 0);
                console.log(result.deletedCount);
            });
    });



    // Search || GET operation  ==> for Book Search
    //#################################################################
    app.get('/searchingBook', (req, res) => {
        //booksCollection.find({})//.limit(20)
        const search = req.query.searchBook;
        console.log(search);

        booksCollection.find({ bookName: { $regex: search } })
            .toArray((err, book) => {
                res.send(book);
            })
    });



    // Order Collection Start    
    //#################################################################
    //#################################################################
    //#################################################################


    // Create || POST operation  ==> for Order
    //#################################################################
    app.post('/bookOrder', (req, res) => {
        const orderBook = req.body;

        orderCollection.insertOne(orderBook)
            .then(result => {
                res.send(result.insertedCount > 0);
                console.log(result.insertedCount > 0);
            });
        console.log({ orderBook });
    });

    
    // Read || GET operation ==> for Order
    //#################################################################
    app.get('/allOrders', (req, res) => {

        // const bearer = req.headers.authorization;
        const userEmail = req.query.email;
        
        orderCollection.find({ email: userEmail })
            .toArray((err, order) => {
                res.send(order);
                console.log(order);
            });


        //     const bearer = req.headers.authorization;
        //     const userEmail = req.query.email;

        //     if (bearer && bearer.startsWith('Bearer ')) {
        //       const idToken = bearer.split(' ')[1];
        //       console.log({ idToken });

        //       // idToken comes from the client app
        //       admin
        //         .auth()
        //         .verifyIdToken(idToken)
        //         .then((decodedToken) => {
        //           //const uid = decodedToken.uid;

        //           const tokenEmail = decodedToken.email;

        //           console.log({ tokenEmail });
        //           console.log({ userEmail });
        //           //====================================
        //           if (tokenEmail === userEmail) {
        //             orderCollection.find({ email: userEmail })
        //               .toArray((err, documents) => {
        //                 res.status(200).send(documents)
        //                 //console.log({ email });
        //               })
        //           } else {
        //             res.status(401).send('un-authorize access : Email Not Match')
        //           }
        //         })
        //         .catch((error) => {
        //           res.status(401).send('un-authorize access : ' + error)
        //         });
        //     } else {
        //       res.status(401).send('un-authorize access for : ' + userEmail)
        //     }

    });

        // Delete || Delete operation  ==> for Books
    //#################################################################
    app.delete('/deleteOrder/:id', (req, res) => {
        const orderId = req.params.id;
        console.log(orderId);

        orderCollection.deleteOne({ _id: ObjectID(orderId) })
            .then(result => {
                res.send(result.deletedCount > 0);
                console.log(result.deletedCount);
            }); 
            
    });


    console.log("DB connection ==> OK");
});
// ################################################################################
// ################################################################################
//                             MongoBD with Server - End
// ################################################################################
// ################################################################################
