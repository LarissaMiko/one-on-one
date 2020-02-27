const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const match = require('./match')
const participants = require('./updateParticipants')
const sessions = require('./updateSessions')
const getParticipantById = require('./getParticipantById')
const getSessionById = require('./getSessionById')
const deleteSessionById = require('./deleteSessionById')
const createUser = require('./createUser')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')

// Middleware
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(cors())

// serve static files in public folder
app.use('/dist', express.static(path.join(__dirname + '/../dist')));
app.use(express.static(path.join(__dirname + '/../dist')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/../dist/index.html'));
  });
  

//POST request from Schedule-mgmt starts updates sessions and participants in database and starts matchmaking
app.post('/start',  async (req,res) => {
    const status = await sessions.updateSessions(req)
    //valid request
    if(status == 201) {
        await participants.updateParticipants(req.body.participants, req.body.id);
        match.make_matches(req.body.participants, req.body.id, req.body.startDate, req.body.endDate);
        res.sendStatus(201);
    } 
    //bad request
    else {
        res.sendStatus(400);
    }
    
})

//POST request triggered when user visits start page
app.post('/newuser',  async (req,res) => {
    const status = await createUser.createUser(req);
    
    if(status == 201){
        res.sendStatus(201);
    }
    else {
        res.sendStatus(400)
    } 
})

//GET request to retrieve user data
app.get('/user/:user_id', async (req,res) => {
    user = await getParticipantById.getParticipantById(req.params.user_id)
    if (user == null){
        res.sendStatus(404)
    }
    else{
        res.send(user)
    }
})

//GET request to retrieve session data
app.get('/session/:event_id', async (req,res) => {
    session = await getSessionById.getSessionById(req.params.event_id)
    if (session == null){
        res.sendStatus(404)
    }
    else{
        res.send(session)
    }
})
//DELETE request to delete expired sessions
app.delete('/session/:event_id', async (req,res) => {
    await deleteSessionById.deleteSessionById(req.params.event_id);
    res.sendStatus(200);
})

// Socket.io
let messages = [];
let index = 0;

// socket functions 
io.on("connection", socket => {
	socket.emit('loggedIn', {
		messages: messages
    });

    //new user connects, set username
    socket.on('newuser', (username)=> {
        console.log(username + " has joined the chat")
        socket.username = username; //TODO brauchen wir das noch?
    })

    // on showContact show the contact information to the other user
    socket.on('showContact' , (user) => {
        io.emit('showContact' , user);
        console.log("showcontact" + user);
    })

    // on message emit message
    socket.on('message', msg => {
        let message = {
            index: index,
            user: msg.user,
            msg: msg.msg
        }
        messages.push(message);
        io.emit('new_message', message);
        index++
    })
    
    // clear message history
    socket.on('nextRound', ()=> {
        messages = []
    })

    //user disconnects
    socket.on('disconnect', () => {
        console.log(`${socket.username} has left the chat`)
        io.emit("userLeft", socket.username);
    })
})

module.exports = http;