const express = require('express') 
const cors = require('cors')
const app = express()
//const port = 3000
const PORT = process.env.PORT || config.httpPort;

// cors - allow connection from different domains and ports
app.use(cors())

// convert json string to json object (from request)
app.use(express.json())

// mongo here...
const mongoose = require('mongoose')
const mongoDB = 'mongodb+srv://Atte_admin:Atte_admin@cluster0.hty5b.mongodb.net/atteDB?retryWrites=true&w=majority'
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log("Database test connected")
})

// Mongoose Scheema and Model here...
// scheema
const todoSchema = new mongoose.Schema({
    text: { type: String, required: true } 
  })
  
  // model
  const Todo = mongoose.model('Todo', todoSchema, 'attetodos')
  
  // Routes here...
  app.post('/attetodos', async (request, response) => {
    const { text, _id } = request.body
    const todo = new Todo({
      text: text
    })
    const savedTodo = await todo.save()
    response.json(savedTodo)  
  })

// todos-route
app.get('/attetodos', async (request, response) => {
    const todos = await Todo.find({})
    response.json(todos)
  })
// todos- get 1
app.get('/attetodos/:id', async (request, response) => {
    const todo = await Todo.findById(request.params.id)
    if (todo) response.json(todo)
    else response.status(404).end()
})

app.delete('/attetodos/:id', async (request, response) => {
    const deletedTodo = await Todo.findByIdAndRemove(request.params.id)
    if (deletedTodo) response.json(deletedTodo)
    else response.status(404).end()
  })

app.put('/attetodos/:id', async (request, response) => {
  const { text } = request.body
  const updatetodo = await Todo.findByIdAndUpdate(request.params.id, {text: text})
  if (updatetodo) response.json(updatetodo)
  else response.status(404).end()
  
  })

// app listen port 3000
app.listen(PORT, () => {
  console.log('Example app listening on port 3000')
})