const express = require('express') 
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000

// cors - allow connection from different domains and ports
app.use(cors())

// convert json string to json object (from request)
app.use(express.json())

// mongo here...
const mongoose = require('mongoose')
const mongoDB = process.env.MONGODB_URI
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
  var http = require('http');
  var fs = require('fs'); // to get data from html file
    
    
  http.createServer(function (req, res) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
    
      // req.url stores the path in the url
      var url = req.url;
      if (url === "/") {
  // fs.readFile looks for the html file
  // the first parameter is the path to the html page
  // the second is the call back function
  // if no file is found the function gives an err
  // if the file is successfully found, the content of the file are contained in pgres
          fs.readFile("head.html", function (err, pgres) {
              if (err)
                  res.write("HEAD.HTML NOT FOUND");
              else {
                  // The following 3 lines
                  // are responsible for sending the html file
                  // and ends the response process
                  res.writeHead(200, { 'Content-Type': 'text/html' });
                  res.write(pgres);
                  res.end();
              }
          });
      }
      else if (url === "/tailPage") {
          fs.readFile("tail.html", function (err, pgres) {
              if (err)
                  res.write("TAIL.HTML NOT FOUND");
              else {
                  res.writeHead(200, { 'Content-Type': 'text/html' });
                  res.write(pgres);
                  res.end();
              }
          });
      }
    
  })

// app listen port 3000
app.listen(port, () => {
  console.log('Example app listening on port 3000')
})