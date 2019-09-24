import React, { useEffect, useContext, useState, createRef, Fragment, ForwardRef} from 'react';
import Context from 'Containers/Host/context'
import { Route } from 'react-router-dom';
// import { subscribeToHostEvents, instructionsComplete } from './socket'
import Join from './Join'
import Instructions from './Instructions'
import AnswerInput from './AnswerInput'
import Responses from './Responses'
import FinalRound from './FinalRound'
import Scores from './Scores'
import Background from './Background'
import Players from './Players'
import { createRounds } from './gameLogic';
import openSocket from 'socket.io-client';
import $ from 'jquery'
import './style.scss'
const socket = openSocket('http://localhost:9000');

function Host() {	
	const state = useContext(Context)
	const [gifs, setGifs] = useState()
	useEffect(() => {	
		socket.on('player-joined', playerJoined)
		socket.on('host-room-generated', roomCodeGenerated)
		socket.on('start-game', startGame)
		socket.on('send-gif', sendGif)
		socket.on('submit-response', submitResponse)
		socket.on('submit-vote', submitVote)
		socket.on('submit-final-response', submitFinalResponse)
		socket.on('submit-final-vote', submitFinalVote)
		socket.on('restart-game', restartGame)
		return () => { 
			socket.removeListener('player-joined', playerJoined)
			socket.removeListener('host-room-generated', roomCodeGenerated)
			socket.removeListener('start-game', startGame)
			socket.removeListener('send-gif', sendGif)
			socket.removeListener('submit-response', submitResponse)
			socket.removeListener('submit-vote', submitVote)
			socket.removeListener('submit-final-vote', submitFinalVote)
			socket.removeListener('submit-final-response', submitFinalResponse)
			socket.removeListener('restart-game', restartGame)
		  };
	},[state])
	
	useEffect(() => {
		socket.emit('host-joined'); 
	}, [])

	useEffect(() => {
		const url = 'https://api.giphy.com/v1/gifs/trending?weirdness=10&api_key=TDNhEXbgLznusuxpAjkSo8CIOXGvVoTj&limit=1'
		$.get(url, (data) => {
			setGifs(data.data)
		})		
	},[])

	function handleRejoin(data){
	// 	'game-over' 
 //        'welcome' 
 //        'waiting-start' 
 //        'waiting' 
 //        'answer-input' 
 //        'final-answer-input' 
 //        'vote' 
 //        'final-vote' 
 		

 		const newPlayers = state.players 
 		const playerIndex = newPlayers.findIndex(p => p.name === data.name)
 		newPlayers[playerIndex].id = data.id 
 		state.setPlayers(newPlayers)

        var routeToSend = 'waiting'
        let ballot;


        if( state.route === 'welcome' ){
        	routeToSend = 'waiting-start'
        } else if(
        	state.route === 'scores' || 
        	state.route === 'final-scores' || 
        	state.route === 'instructions'
        ){
        	routeToSend = 'waiting'
        } else if (
        	state.route === 'answer-input' 
        ){
        	if (state.players[playerIndex].hasResponded){
        		routeToSend = 'waiting'
        	} else {
        		//probably need to check which question here
        		routeToSend = 'answer-input'
        	}
        } else if (state.route === 'player-response'){
        	if (state.players[playerIndex].hasVoted || findIfPlayerInActiveQuesion(data.name)){
        		routeToSend = 'waiting'
        	} else {
        		//probably need to send correct ballot here
        		routeToSend = 'vote'
        		ballot = state.rounds[state.round][state.responseIndex]
        		console.log('ballot', ballot)
        	}
        }


	// {state.route === 'answer-input' && <AnswerInput /> } 
	// 		{state.route === 'player-response' && <Responses {...state.rounds[state.round][state.responseIndex]} showVotes={state.showVotes}/> } 
	// 		{state.route === 'final-round' && <FinalRound {...state.rounds[state.rounds.length-1]} /> } 
	// 		{state.route === 'final-round-ballot' && <FinalRound isBallot allVotesIn={state.allFinalVotesIn} showFinalScores={showFinalScores} {...state.rounds[state.rounds.length-1]} /> } 

	console.warn('REJOIN')
		socket.emit('send-player-model', {
			players: [state.players[playerIndex]], 
			round: state.round, 
			route: routeToSend, 
			room: state.host.long,
			ballot: ballot,
		})
		
	}	


	function findIfPlayerInActiveQuesion(name){
		let playersInQuestion = state.rounds[state.round][state.responseIndex].players
		for (var i in playersInQuestion){
			if (playersInQuestion[i].name === name){
				return true
			}
		}
		return false
	}


	function roomCodeGenerated(data){
		state.setHost(data)
	}

	useEffect(() => {
		if (state.showVotes.max){
			if (state.showVotes.index <= state.showVotes.max ){
				setTimeout(() => {
					state.setShowVotes({
						max: state.showVotes.max,
						index: state.showVotes.index + 1,
						showScore:false,
					})
				}, 500)
			} else if (state.route === 'player-response' && !state.showVotes.showScore){
				setTimeout(() => {
				state.setShowVotes({
					max: state.showVotes.max,
					index: state.showVotes.index + 1,
					showScore: true
				})
				}, 1000)
			} else {
				setTimeout(() => {
					state.setShowVotes({
						max: 0,
						index: 0,
						showScore: false
					})
					voteOnNextGif()
				}, 2000)
			}
		}		
	},[state.showVotes])


	function restartGame(){
		var newPlayers = Object.assign([], state.players)
		for (var i in newPlayers){
			newPlayers[i].score = 0
			newPlayers[i].roundScore = 0
			newPlayers[i].position = 0
			newPlayers[i].answers = []
			newPlayers[i].isConnected = true
			newPlayers[i].gifs = {
				0:[],
				1:[],
				2:[]
			}
		}
		state.setPlayers(newPlayers)
		state.setRound(0)
		state.setRound(0)
		state.setAllFinalVotesIn(false)
		state.setResponseIndex(0)
		state.setShowVotes({
			max:null,
			index:0,
			showScore:false,
		})
		createRounds(state.players).then((data) => {
			state.setRounds(data.rounds)	
			state.setPlayers(data.players)
			state.setRoute('answer-input')
			socket.emit('send-player-model', {players: data.players, round: state.round, route: 'answer-input'})
		})
	}

	function playerJoined(data){
		console.log('player joined', data)
		const existing = state.players.find(p => p.name === data.name)
		if (existing){
			
			// handle reconnection
			handleRejoin(data)
			//should always return up to date player model so correct data is stored on client side.
		} else if (state.route === 'welcome'){
			var newPlayers = Object.assign([], state.players)
			var newPlayer = Object.assign({
				name: '',
				id: '',
				score: 0,
				roundScore: 0,
				position: 0,
				answers: [],
				isConnected: true,
				gifs: {
					0:[],
					1:[],
					2:[]
				}
			}, data)
			newPlayers.push(newPlayer)
			state.setPlayers(newPlayers)
			socket.emit('confirm-joined', {
				id: data.id,
				room: state.host
			})
		}
	}


	function startGame(){
		state.setRoute('instructions')

	}

	function sendGif(data){
		
	}

	function instructionsComplete(){
		createRounds(state.players).then((data) => {
			console.log('setup', data)
			state.setRounds(data.rounds)	
			// console.log('initiating rounds', data.rounds)		
			state.setPlayers(data.players)
			// return playFinalRound()
			state.setRoute('answer-input')
			socket.emit('send-player-model', {players: data.players, round: state.round, route: 'answer-input'})
		})
	}

	function gameOver(){
		socket.emit('game-over')
	}

	function submitResponse(data){
		var rounds = Object.assign([], state.rounds)
		console.log(rounds, data.response.question, state.round, data)
		rounds[state.round][data.response.question].players[data.response.player].answer = data.response.response
		if (data.hasResponded){
			let newPlayers = Object.assign([], state.players)
			let index= newPlayers.findIndex(p => p.name === rounds[state.round][data.response.question].players[data.response.player].name)
			newPlayers[index].hasResponded = true
			state.setPlayers(newPlayers)
		}

		state.setRounds(rounds)
		// console.log('submitted', rounds)
		if (checkAllAnswersSubmitted(state.rounds[state.round])){
			resetAllPlayersHaveResponded()
			showResponse(0)
		} else {
			
		}
	}

	function adjustScores(round){
		var newPlayers = Object.assign([], state.players)
		for (var i = 0; i < round.length; i++){
			for (var j = 0; j< round[i].players.length; j++){
				const index = newPlayers.findIndex(p => p.name === round[i].players[j].name)
				
				newPlayers[index].roundScore += 250 * round[i].players[j].votes.length;
			}
		}

		state.setPlayers(newPlayers)
		
	}

	function resetAllPlayersHaveResponded(){
	  let newPlayers = Object.assign([], state.players)
	  for(var i =0; i < newPlayers.length; i++){
	    newPlayers[i].hasResponded = false
	  }
	  state.setPlayers(newPlayers)
	}


	function checkAllAnswersSubmitted(round){
		for (var i = 0; i < round.length; i++){
			for (var j = 0; j < round[i].players.length; j++){
				if (!round[i].players[j].answer){
					return false
				}
			}
		}
		
		return true
	}

	function showResponse(i){
		const round = state.rounds[state.round]
		if (i < round.length){
			
			state.setRoute('player-response')
			socket.emit('send-ballot', state.rounds[state.round][i])
		} else {
			
			adjustScores(state.rounds[state.round])
			state.setRoute('scores')
			
		}
	}

	function nextRound(){
		const nextRound = state.round + 1
		// console.log('next eround', state.rounds)
		if (nextRound < state.rounds.length -1){
			socket.emit('generic-set', {round: nextRound, route: 'answer-input'})
			state.setRound(nextRound)
			state.setResponseIndex(0)
			state.setRoute('answer-input')
		} else {	
			playFinalRound()
		}
	}

	function playFinalRound(){
		
		state.setRoute('final-round')
		socket.emit('final-round-answer-input')
	}

	function submitVote(data){
		//update responses
		var rounds = Object.assign([], state.rounds)
		rounds[state.round][state.responseIndex].players[data.index].votes.push(data)
		//set player has voted
		var newPlayers = Object.assign([], state.players)
		const playerIndex = newPlayers.findIndex(p => p.name === data.name)
		newPlayers[playerIndex].hasVoted = true
		//update state
		state.setPlayers(newPlayers)
		state.setRounds(rounds)
		//next
		if (allVotesIn()){
			revealVotes()
		} 
	}

	function revealVotes(){
		const rounds = Object.assign([], state.rounds)
		const round = rounds[state.round][state.responseIndex]
		var maxVotes= 0

		for (var i = 0; i < round.players.length; i++){
			if (round.players[i].votes.length > maxVotes){
				maxVotes = round.players[i].votes.length
			}
		}
		
		// revealVote(0, maxVotes)
		state.setShowVotes({
			max: maxVotes,
			index:0
		})

	}



	function voteOnNextGif(){
		state.setRoute('')
		state.setRoute('player-response')
		state.setResponseIndex(state.responseIndex + 1)
		showResponse(state.responseIndex + 1)
	}


	function allVotesIn(){
		const question = state.rounds[state.round][state.responseIndex]
		var votes= 0
		for (var i = 0; i < question.players.length; i++){
			votes += question.players[i].votes.length 
		}
		if (votes >= state.players.length -2){
			resetAllPlayersHaveResponded()
		 	return true
		}
		else return false
	}

	function submitFinalResponse(data){		
		var newRounds = Object.assign([], state.rounds)
		var newPlayers = Object.assign([], state.players)
		const index = newRounds[newRounds.length-1].players.findIndex(p => p.name === data.name)
		newRounds[newRounds.length-1].players[index].answer = data.response 
		state.setRounds(newRounds)

		let playerIndex = newPlayers.findIndex(p => p.name === data.name)
		newPlayers[playerIndex].hasResponded = true
		state.setPlayers(newPlayers)
		if (allFinalResponsesIn(newRounds)){
			state.setRoute('final-round-ballot')
			socket.emit('final-round-ballot', newRounds[newRounds.length -1])
		}
	}

	function allFinalResponsesIn(rounds){
		let round = rounds[rounds.length-1] 
		var count = 0
		for (var i = 0; i < round.players.length; i++){
			if (round.players[i].answer){
				count += 1
			}
		}
		if (count >= round.players.length) return true
		else return false
	}

	function submitFinalVote(data){
		console.log('submitting data', data)
		var newRounds = Object.assign([], state.rounds)
		const round = state.rounds[state.rounds.length -1]
		console.log(round, state.rounds)
		round.players[data.player].votes[data.order] += 1

		newRounds[newRounds.length-1] = round

		state.setRounds(newRounds)

		if (allFinalVotesIn(round)){
			console.log('all answers in', round)
			state.setAllFinalVotesIn(true)
			
		}
	}

	function allFinalVotesIn(round){
		var count = 0
		for (var i = 0; i < round.players.length; i++){
			count += round.players[i].votes[0]
			count += round.players[i].votes[1]
			count += round.players[i].votes[2]
		}
		
		if (count === round.players.length * 3){
			resetAllPlayersHaveResponded()
			return true

		} 
		else return false
	}

	function showFinalScores(){
		var newPlayers = Object.assign([], state.players)
		const round = state.rounds[state.rounds.length-1]
		console.log(newPlayers, round)
		for (var  i = 0; i < round.players.length; i++){
			const votes = round.players[i].votes
			const playerIndex = newPlayers.findIndex((p) =>p.name ===  round.players[i].name)
			newPlayers[playerIndex].roundScore = (votes['0'] * 250) + (votes['1'] * 150) + (votes['2'] * 100) 
		}
		console.log(newPlayers)
	

		state.setPlayers(newPlayers)
		state.setRoute('final-scores')
	}

	

	return (     
		<div className="hostContainer">
			<Background 
				gif={
					state.route === 'scores'  ? require('assets/static.gif') :
					state.route === 'welcome' ?  null :
					state.route === 'player-response' ? state.rounds[state.round][state.responseIndex] ? state.rounds[state.round][state.responseIndex].gif : null :
					state.route === 'final-round' ? state.rounds[state.rounds.length-1].gif :
					state.route === 'final-round-ballot' ? state.rounds[state.rounds.length-1].gif :
					null
				}
				roomcode={state.host ? state.host.short : false}
				route={
					state.route
				}
			/>
			<Players route={state.route} players={state.players}/>
			{state.route === 'scores' && <Scores nextRound={nextRound}/>}
			{state.route === 'final-scores' && <Scores isFinal gameOver={gameOver}/>}
			{/*state.route === 'welcome' && <Join /> */} 
			{state.route === 'instructions' && <Instructions onComplete={instructionsComplete} /> } 

			{state.route === 'answer-input' && <AnswerInput /> } 
			{state.route === 'player-response' && <Responses {...state.rounds[state.round][state.responseIndex]} showVotes={state.showVotes}/> } 
			{state.route === 'final-round' && <FinalRound {...state.rounds[state.rounds.length-1]} /> } 
			{state.route === 'final-round-ballot' && <FinalRound isBallot allVotesIn={state.allFinalVotesIn} showFinalScores={showFinalScores} {...state.rounds[state.rounds.length-1]} /> } 
		</div>
	);
}

export default Host;

