const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 80
const app = express()
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.MONGO_ADMIN}:${process.env.MONGO_PASS}@cluster0.c1tum.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const todoCollection = client.db("todoDB").collection("todo")
        app.get('/todo', async (req, res) => {
            res.send(await todoCollection.find({ email: req.query.user }).toArray())
        })
        app.post('/todo', async (req, res) => {
            res.send(await todoCollection.insertOne(req.body))
        })
        app.post('/todo/search', async (req, res) => {
            const query = req.body.query
            res.send(await todoCollection.findOne({ title: query }))
        })

        app.put('/todo/:id', async (req, res) => {
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    completed: true
                },
            };
            res.send(await todoCollection.updateOne({ _id: ObjectId(req.params.id) }, updateDoc, options))
        })
        app.patch('/todo/:id', async (req, res) => {
            const updateDoc = {
                $set: {
                    title: req.body.title,
                    desc: req.body.desc
                },
            };
            res.send(await todoCollection.updateOne({ _id: ObjectId(req.params.id) }, updateDoc))
        })

        app.delete('/todo/:id', async (req, res) => {
            res.send(await todoCollection.deleteOne({ _id: ObjectId(req.params.id) }))
        })
        app.delete('/todos/completed', async (req, res) => {
            res.send(await todoCollection.deleteMany({ completed: true }))
        })

    } finally {
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Hello World! todo server is up n runnin')
})

app.listen(port)