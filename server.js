const express = require('express');
const userDb = require('./users/userDb.js')
const postDb = require('./posts/postDb.js')
const cors = require('cors')

const server = express();
server.use(express.json());
//stretch problem
server.use(cors())

server.get('/', (req, res) => {
  res.send(`<h2>Good morning World! We do middleware today!</h2>`)
});

//custom middleware
function logger(request, response, next) {
  console.log(`Request method: ${request.method}, Request url: ${request.url}, Request time: ${new Date()}`)
  next()
}
function validateUserId(request, response, next) {
  const { id } = request.params
  userDb.getById(id)
  .then(user => {
  if (user) {
      request.user = user
      next()
  }
  else {
      response.status(400).json({message: "invalid user id"})
  }
}) 
}
function validateUser(request, response, next) {
  const requestBody = request.body
  if (!requestBody) {
      response.status(400).json({ message: "missing user data" })
  }
  else if (!requestBody.name) {
      response.status(400).json({ message: "missing required text field"})
  }
}
function validatePost(request, response, next) {
  const requestBody = request.body
  if (!requestBody.name) {
    response.status(400).json({ message: "missing data"})
  }

  next()
}

server.use(logger)

server.get('/user/:id/posts', validateUserId, (request, response) => {
  postDb.getById(request.user.id)
  .then(posts => {
    if(posts) {
      response.status(200).json(posts)
    }
  })
})

server.post('/user/:id', validatePost, (request, response) => {
  postDb.insert(request.body)
  .then(post => {
    if(post) {
      response.status(201).json(post)
    }
  })    
})

server.listen(7000, () => console.log('running'))

module.exports = server;
