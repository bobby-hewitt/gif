import React, { useContext, Fragment} from 'react';
import openSocket from 'socket.io-client';
import { playerModel } from './setup'
import { createRounds } from './gameLogic'
import Context from 'Containers/Host/context'



function Socket (){
	const state = useContext(Context)
	const  socket = openSocket('http://localhost:9000');

	function subscribeToHostEvents() {
		console.log('host subscribing')
		socket.emit('host-joined');  	
		socket.on('player-joined', playerJoined.bind(this))
		socket.on('host-room-generated', roomCodeGenerated.bind(this))
		socket.on('start-game', startGame.bind(this))
		socket.on('send-gif', sendGif.bind(this))
		socket.on('submit-response', submitResponse.bind(this))
	}

	function roomCodeGenerated(data){
		state.setHost(data)
	}

	function playerJoined(data){
		const existing = state.players.find(p => p.name === data.name)
		if (existing){
			// handle reconnection
			//should always return up to date player model so correct data is stored on client side.
		} else if (state.route === 'welcome'){
			//new player join
			var newPlayer = Object.assign({
				name: '',
				id: '',
				score: 0,
				answers: [],
				isConnected: true,
				gifs: {
					0:[],
					1:[],
					2:[]
				}
			}, data)
			state.players.push(newPlayer)
			state.setPlayers(state.players)
		}
	}

	function startGame(state){
		state.setRoute('instructions')
	}

	function sendGif(data){
		console.log('receiving', data)
	}

	function instructionsComplete(state){
		console.log('instructions complete')
		//custom logic.
		createRounds(state.players).then((data) => {
			console.log('setting up', data)
			state.setRounds(data.rounds)
			setTimeout(() => {
				console.log(state.rounds)
			},300)
			
			state.setPlayers(data.players)
			state.setRoute('answer-input')
			socket.emit('send-player-model', {players: data.players, round: state.round, route: 'answer-input'})
		})
		//custom logic.
	}

	function submitResponse(data){
		// console.log('received response', data)
		const { round } = state

		console.log('rounds', state)
		var rounds = Object.assign([], state.rounds)
		rounds[round][data.question].players[data.player].answer = data.response 
		state.setRounds(rounds)
		console.log(state.rounds)
	}
	return(
		<Fragment />
	)
}







// const players = ['A', 'B']

// createRounds(players).then((data) => {
// 		// state.setRounds(data)
// 		// state.setRoute('answer-input')
// 		console.log('sending round',data)
// 		// socket.emit('send-round', data[state.round])
// 	})




export default Socket


// { 
// 	subscribeToHostEvents: Socket.subscribeToHostEvents,
// 	instructionsComplete: Socket.instructionsComplete
// };

