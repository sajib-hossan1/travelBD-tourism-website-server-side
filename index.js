const express = require('express');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId ;
const { MongoClient } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cowhf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        
        const database = client.db('travel-bd');
        const destinationCollection = database.collection('destinations');
        const orderCollection = database.collection('booking');

        // GET API to load data from mongodb
        app.get('/destinations', async(req, res) => {
            const cursor = destinationCollection.find({});
            const destinations = await cursor.toArray();
            res.send(destinations)
        })

        
        // GET API to load all booking data from mongodb
        app.get('/allBooking', async(req, res) => {
            const cursor = orderCollection.find({});
            const allBooking = await cursor.toArray();
            res.send(allBooking)
        })

        
        // GET API to load all booking data from mongodb=============
        app.get('/destinations/:id', async(req, res) => {
            const id = req.params.id ;
            const query = {_id : ObjectId(id)};
            const allBooking = await destinationCollection.findOne(query);
            res.send(allBooking)
        })


        // GET Api for my booking 
        app.get('/booking/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email : email };
            const result = await orderCollection.find(query);
            res.send(result)
        })


        // get a single item 
        app.get('/destination/:id', async (req, res) => {
            const id = req.params.id ;
            const query = {_id : ObjectId(id)};
            const destination = await destinationCollection.findOne(query);
            res.send(destination)
        })


        // POST api
        app.post('/addNewDestination', async (req, res) => {
            const destination = req.body;
            const result = await destinationCollection.insertOne(destination);

            res.json(result);
        })



        // Add Orders Api
        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const result = await orderCollection.insertOne(booking);
            res.json(result);
        })

        // DELETE api
        app.delete('/booking/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email : email };
            const result = await orderCollection.deleteOne(query);
            res.send(result)
        })


        // DELETE api
        app.delete('/myBooking/:id', async (req, res) => {
            const email = req.params.id;
            const query = { _id : id };
            const result = await orderCollection.deleteOne(query);
            res.send(result)
        })



    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('The server is running')
});

app.listen(port, () => {
    console.log('The server is running this port', port);
})