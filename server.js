const express = require("express");
const userDb = require("./users/userDb.js");
const postDb = require("./posts/postDb.js");
const cors = require("cors");

const server = express();
server.use(express.json());
server.use(cors());

function logger(request, response, next) {
  console.log(
    `Request method: ${request.method}, Request url: ${
      request.url
    }, Request time: ${new Date()}`
  );
  next();
}
function validateUserId(request, response, next) {
  const { id } = request.params;
  userDb.getById(id).then(user => {
    if (user) {
      next();
    } else {
      response.status(400).json({ message: "invalid user id" });
      next();
    }
  });
}

function validatePost(request, response, next) {
  const requestBody = request.body;
  console.log(requestBody);
  if (Object.keys(requestBody).length === 0) {
    response.status(400).json({ message: "missing post data" });
    next();
  }
  if (!requestBody.text) {
    response.status(400).json({ message: "missing required text field" });
    next();
  } else {
    next();
  }
}

function validateUser(request, response, next) {
  const requestBody = request.body;
  console.log(requestBody);
  if (Object.keys(requestBody).length === 0) {
    response.status(400).json({ message: "missing user data" });
    next();
  }
  if (!requestBody.name) {
    response.status(400).json({ message: "missing required name field" });
    next();
  } else {
    next();
  }
}

server.use(logger);

//endpoints
server.get("/", (req, res) => {
  res.send(`<h2>Good morning World! We do middleware today!</h2>`);
});

//crud users
server.post("/users", validateUser, (request, response) => {
  const requestBody = request.body;
  userDb.insert(requestBody).then(user => {
    if (user) {
      response.status(201).json(user);
    }
  });
});
server.get("/users", (request, response) => {
  userDb.get().then(users => {
    if (users) {
      response.status(200).json(users);
    }
  });
});
server.put("/users/:id", (request, response) => {
  const updatedObject = request.body;
  const { id } = request.params;
  userDb.update(id, updatedObject).then(users => {
    if (users) {
      response.status(200).json(users);
    }
  });
});
server.delete("/users/:id", (request, response) => {
  const { id } = request.params;
  userDb.remove(id).then(users => {
    response.status(200).json(users);
  });
});
server.get("/user/:id/posts", validateUserId, (request, response) => {
  userDb.getUserPosts(request.params.id).then(posts => {
    if (posts) {
      response.status(200).json(posts);
    }
  });
});
server.post("/user/:id", validateUserId, validatePost, (request, response) => {
  postDb.insert(request.body).then(post => {
    if (post) {
      response.status(201).json(post);
    }
  });
});
//crud posts
server.get("/posts", (request, response) => {
  postDb.get().then(posts => {
    if (posts) {
      response.status(200).json(posts);
    }
  });
});

server.listen(7000, () => console.log("API Running on 7000, SUCCESS"));

module.exports = server;
