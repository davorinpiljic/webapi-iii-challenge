// code away!
function logger(request, response, next) {
    console.log(`Request method: ${request.method}, Request url: ${request.url}, Request time: ${new Date()}`)
}

server.use(logger)

function validateUserId(request, response, next) {
    const { id } = request.params
    if (id) {
        request.user = id
    }
    else {
        response.status(400).json({message: "invalid user id"})
    }
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
    if (!request.body) {
        response.status(400).json({message: "missing post data"})
    }
    else if (!request.body.text) {
        response.status(400).json({message: "missing required text field"})
    }
}

// Build an API to let clients perform CRUD operations on users.
// Add endpoints to retrieve the list of posts for a user and to store a new post for a user.

//get post  list for user 
server.get('/user/:id/posts', (request, response) => {

})
//post new post for a user
server.post('/user/:id', (request, response) => {
    
})