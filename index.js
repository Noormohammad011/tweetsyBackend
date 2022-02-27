const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId

//initialization
const app = express()

app.use(express.json())
app.use(cors())

//monogdb Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@noyonecommerce.qnayd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

app.get('/', (req, res) => {
  res.send('Running my CRUD Server')
})

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

async function run() {
  try {
    await client.connect()
    const TaskCollection = client.db('TaskCollection')

    app.get('/tasks', async (req, res) => {
      const tasks = await TaskCollection.collection('tasks').find().toArray()
      res.json(tasks)
    })
    app.post('/tasks', async (req, res) => {
      const tasks = await TaskCollection.collection('tasks').insertOne(req.body)
      res.json(tasks)
    })
    app.get('/tasks/:id', async (req, res) => {  
      const tasks = await TaskCollection.collection('tasks').findOne({ _id: ObjectId(req.params.id) })
      res.json(tasks)
    })
    app.put('/tasks/:id', async (req, res) => {
      const tasks = await TaskCollection.collection('tasks').updateOne(
        { _id: ObjectId(req.params.id) },
        { $set: req.body }
      )
      res.json(tasks)
    })
    app.delete('/tasks/:id', async (req, res) => {
      const tasks = await TaskCollection.collection('tasks').deleteOne({
        _id: ObjectId(req.params.id),
      })
      res.json(tasks)
    })
  } finally {
    // await client.close();
  }
}

run().catch(console.dir)
