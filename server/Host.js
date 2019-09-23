const Rooms = require('./Models/room')

exports.connected = function(socket){
	console.log('host connected')
	function createCode(){
		var possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ";
		var text = '';
		for (var i = 0; i < 4; i++){
    		text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}
	function createUniqueRoomId(){
		let room = createCode()
		Rooms.findOne({short: room}, function(err, result){
			if (result) return createUniqueRoomId()
			storeRoom(room)
		})
	}
	function storeRoom(room){
		Rooms.create({short: room, long: socket.id}, (err, roomToSend)=> {
			socket.emit('host-room-generated', roomToSend)
		})
	}
	const code = 'ABCD'
	function createDevRoom(){
		Rooms.findOne({short: code}, function(err, result){
			if (result) return deleteRooms()
			createRoom()
		})
	}
	function deleteRooms(){
		Rooms.remove({}, () => {
			createRoom()
		})
	}
	function createRoom(){
		Rooms.create({short: code, long: socket.id}, (err, room)=> {
			console.log('generated, ', room)
			socket.emit('host-room-generated', room)
		})
	}

	if (process.env.IS_DEV){
		createDevRoom()
	} else {
		createUniqueRoomId()
	}
}

exports.sendPlayerModel = (socket, data) => {
	for (var i = 0; i < data.players.length; i++){
		socket.to(data.players[i].id).emit('send-player-model', {
			...data,
			player: data.players[i],
			room: socket.id,

		})
	}
}

exports.confirmJoined = (socket, data) => {
	console.log('confirmed', data)
	socket.to(data.id).emit('success-joining', data.room)
}

exports.gameOver = (socket, data) => {
	socket.broadcast.to(socket.id).emit('game-over')
}

exports.sendBallot = (socket, data) => {
	
	socket.broadcast.to(socket.id).emit('send-ballot', data)
}

exports.genericSet = (socket, data) => {
	socket.broadcast.to(socket.id).emit('generic-set', data)
}

exports.finalRoundAnswerInput = (socket, data) => {
	socket.broadcast.to(socket.id).emit('final-round-answer-input')	
}

exports.finalRoundBallot = (socket, data) => {
	socket.broadcast.to(socket.id).emit('final-round-ballot', data)
}
