const cors = require('cors')
const express = require('express')
const app = express()
const path = require('path')
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config({path: '.env'})
var PORT = process.env.PORT || 9000
app.use(cors())
app.use(express.static(path.resolve(__dirname, '..', 'build')));
app.use( bodyParser.json());       
app.use(bodyParser.urlencoded({extended: true })) 
const Rooms = require('./Models/room')
const Player = require('./Player')
const Host = require('./Host')
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
mongoose.connection.on('error', () => console.info('Error: Could not connect to MongoDB.?'));
mongoose.connection.on('connected', () =>  console.info('Successfully connected to the database'))
//always send user to build dir
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});
//socket listeners
io.on('connection', function(socket){
  	//host
  	socket.on('disconnect', disconnect.bind(this, socket));
  	socket.on('host-joined', Host.connected.bind(this, socket)) 	
  	//player
  	socket.on('player-joined', Player.connected.bind(this, socket)) 	
  	socket.on('start-game', Player.start.bind(this, socket)) 	
    socket.on('confirm-joined', Host.confirmJoined.bind(this, socket))
  	//custom logic.
  	// socket.on('send-round', Host.sendRound.bind(this, socket))
  	socket.on('send-player-model', Host.sendPlayerModel.bind(this, socket))
    // socket.on('send-player-model-single', Host.sendPlayerModelSingle(this, socket))
  	socket.on('submit-response', Player.submitResponse.bind(this, socket))
  	socket.on('send-ballot', Host.sendBallot.bind(this, socket))
  	socket.on('submit-vote', Player.submitVote.bind(this, socket))
  	socket.on('generic-set', Host.genericSet.bind(this, socket))
  	socket.on('final-round-answer-input', Host.finalRoundAnswerInput.bind(this, socket))
  	socket.on('submit-final-response', Player.submitFinalResponse.bind(this, socket))
  	socket.on('final-round-ballot', Host.finalRoundBallot.bind(this, socket))
  	socket.on('submit-final-vote', Player.submitFinalVote.bind(this, socket))
    socket.on('game-over', Host.gameOver.bind(this, socket))
    socket.on('restart-game', Player.restartGame.bind(this, socket))
});
//disconnection
function disconnect(socket){
	Rooms.findOne({long: socket.id}, (err, room) => {
		if (room){
			console.log('host gone')
			socket.broadcast.to(room.long).emit('host-disconnected')
			return room.remove()
		} 
		else {
			const rooms = Object.keys(socket.adapter.rooms)
			for (var i = 0; i < rooms.length; i++){
				if (rooms[i] !== socket.id){
					socket.broadcast.to(rooms[i]).emit('player-left', {id: socket.id});
				}
			}
		}
	})
}
//server listens
http.listen(PORT, function(err){
	if (err) return console.log(err)
	else return console.log('listening one', PORT);
});