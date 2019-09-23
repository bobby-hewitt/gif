const Rooms = require('./Models/room')

exports.connected = function(socket, playerData){
	Rooms.findOne({short: playerData.room}, function(err, result){
		if (err){	
			console.log('errr joinging')
			return socket.emit('error-joining')
		} else if (result) {
			console.log('player joinging')
			socket.join(result.long)
			socket.to(result.long).emit('player-joined', playerData);
			result.player = playerData
			console.log('sending rejoin')
			// socket.emit('success-joining', result)
		} else {
			return socket.emit('error-joining')
		}
	})
}



exports.start = (socket, data) => {
	socket.broadcast.to(data).emit('start-game')
}

exports.submitResponse = (socket, data) => {
	socket.to(data.room).emit('submit-response', data)
}

exports.submitVote = (socket, data) => {
	socket.to(data.room).emit('submit-vote', data.response)
}

exports.submitFinalResponse = (socket, data) => {
	socket.to(data.room).emit('submit-final-response', data)	
}

exports.submitFinalVote = (socket, data) => {
	socket.to(data.room).emit('submit-final-vote', data)		
}
exports.restartGame = (socket, data) => {
	console.log('data',data)
	socket.to(data).emit('restart-game')		
}
	