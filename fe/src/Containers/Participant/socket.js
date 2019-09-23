import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:9000');

function subscribeToEvents(state) {
	console.log('player subscribing')
	socket.on('error-joining', errorJoining.bind(this, state))
	socket.on('success-joining', successJoining.bind(this, state))
	socket.on('start-game', setRoute.bind(this, state, 'waiting'))
	socket.on('send-player-model', setPlayerModel.bind(this, state))
	socket.on('send-ballot', sendBallot.bind(this, state))
	if (process.env.NODE_ENV === 'development'){
		setTimeout(() => {
			joinRoom(state, {
				room:'ABCD',
				id: '',
				name: Math.floor(Math.random() * 1000)
			})
		},500)
		
	}
}




function joinRoom(state, data){
	data.id = socket.id 
	socket.emit('player-joined', data)
	setRoute(state, 'waiting-start')
}

function sendBallot(state,data){

	console.log('getting ballot')
	const ownAnswer = data.players.findIndex(p => p.name === state.player.name)
	console.log(ownAnswer, state.player, data.players)
	if (ownAnswer > -1){
		console.log('getting ballot own')
		state.setRoute('waiting')
	} else {
		console.log('getting ballot other')
		state.setBallot(data)
		state.setRoute('vote')
	
	}
	
}

function errorJoining(state){
	console.warn('error joining room')
}

function successJoining(state, data){
	console.log(data)
	state.setRoom(data.long)
	console.warn('success joining room')
}

function startGame(state){
	socket.emit('start-game', state.room)
	state.setRoute('waiting')
}

function setPlayerModel(state, data){
	console.log('setting self', data)
	state.setPlayer(data.player)
	if (data.route) setRoute(state, data.route)
	if (data.round) state.setRound(data.round)
}

function setRoute(state, route){
	state.setRoute(route)
}

function submitResponse(state, response){
	const { gifIndex, setGifIndex } = state
	let data = state.player.gifs[state.round][state.gifIndex]
	data.response = response
	const room = state.room 
	const toSend = {
		response: data,
		room
	}
	if (!gifIndex){
		setGifIndex(1)
		socket.emit('submit-response', toSend)
	} else {
		setGifIndex(0)
		socket.emit('submit-response', toSend)
		state.setRoute('waiting')
		
	}
}

function submitVote(state, response){
	const room = state.room 
	socket.emit('submit-vote', {response, room }) 
}

export { 
	submitVote,
	subscribeToEvents,
	joinRoom,
	submitResponse,
	startGame
};