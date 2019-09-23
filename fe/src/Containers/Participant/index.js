import React, { useEffect, useContext, Fragment} from 'react';
import Context from 'Containers/Participant/context'

import Join from './Join'
import Waiting from './Waiting'
import AnswerInput from './AnswerInput'
import FinalAnswerInput from './FinalAnswerInput'
import Vote from './Vote'
import GameOver from './GameOver'
import openSocket from 'socket.io-client';
import { Background } from 'Components'
import './style.scss'

const  socket = openSocket('http://172.20.10.3:9000');


function Player(props) {
	const state = useContext(Context)
	useEffect(() => {
    socket.on('error-joining', errorJoining)
    socket.on('success-joining', successJoining)
    socket.on('start-game', setRoute)
    socket.on('send-player-model', setPlayerModel)
    socket.on('send-ballot', sendBallot)
    socket.on('generic-set', genericSet)
    socket.on('final-round-answer-input', finalRoundAnswerInput)
    socket.on('final-round-ballot', finalRoundBallot)
    socket.on('game-over', gameOver)
    return () => {
      socket.removeListener('error-joining', errorJoining)
      socket.removeListener('success-joining', successJoining)
      socket.removeListener('start-game', setRoute)
      socket.removeListener('send-player-model', setPlayerModel)
      socket.removeListener('send-ballot', sendBallot)
      socket.removeListener('generic-set', genericSet)
      socket.removeListener('final-round-answer-input', finalRoundAnswerInput)
      socket.removeListener('game-over',gameOver)
    }
	},[state])

 useEffect(()=> {
    // if (process.env.NODE_ENV === 'development'){
    //   setTimeout(() => {
    //     joinRoom( {
    //       room:'ABCD',
    //       id: '',
    //       name: Math.floor(Math.random() * 1000) + ' ' + Math.floor(Math.random() * 1000)
    //     })
    //   },0)
    // }


 },[])

  const onStartGame = () =>{
    startGame(state)
  }




  const onSubmitResponse = (response) => {
    submitResponse( response)
  }

function gameOver(){
  state.setRoute('game-over')
}

function joinRoom( data){
  data.id = socket.id 
  socket.emit('player-joined', data)
  // setRoute( 'waiting-start')
}

function sendBallot(data){
  state.setBallot(data)
  const ownAnswer = data.players.findIndex(p => p.name === state.player.name)
  console.log(ownAnswer, state.player, data.players)
  if (ownAnswer > -1){
    state.setRoute('waiting')
  } else {
    console.log('setting ballot', data)
    state.setBallot(data)
      state.setRoute('vote')
    

    
    
  
  }
  
}

function errorJoining(){
  console.warn('error joining room')
}


function successJoining(data){
  state.setRoom(data.long)
  state.setRoute('waiting-start')
}

function startGame(state){
  socket.emit('start-game', state.room)
  state.setRoute('waiting')
}

function restartGame(){
  socket.emit('restart-game', state.room)
}



function setPlayerModel( data){
  console.log('setting player model', data)
  state.setPlayer(data.player)
  if (data.room) state.setRoom(data.room)
  if (data.route) setRoute(data.route)
  if (data.round) state.setRound(data.round)
  if (data.ballot) {
    console.log(data.ballot)
    state.setBallot(data.ballot)
  }
}

function genericSet(data){
  if (data.route) setRoute( data.route)
  if (data.round) state.setRound(data.round)
}

function setRoute(route){
  state.setRoute(route)
}


function submitResponse(response){
  const { gifIndex, setGifIndex } = state
  let data = state.player.gifs[state.round][state.gifIndex]
  data.response = response
  const room = state.room 
  const toSend = {
    hasResponded: state.gifIndex === 1,
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


function finalRoundAnswerInput(){
  state.setRoute('final-answer-input')  
}

function onSubmitFinalResponse(response){
  state.setRoute('waiting')
  console.log('state',state)
  socket.emit('submit-final-response', {
    name: state.player.name,
    room: state.room,
    response
  })
}

function finalRoundBallot(data){
  state.setRoute('final-vote')
  state.setBallot(data)
}

function onSubmitFinalVote(index){
    console.log('submitting vote for,', index, 'order', state.finalVoteIndex)
    if (state.finalVoteIndex < 2 && !state.ballot.players[index].medal){
      socket.emit('submit-final-vote', {
        player: index, 
        order: state.finalVoteIndex,
        room: state.room
      })
      state.setFinalVoteIndex(state.finalVoteIndex + 1)

      var newBallot = Object.assign({}, state.ballot)
      newBallot.players[index].medal = state.finalVoteIndex === 0 ? 'Gold' : state.finalVoteIndex  === 1 ? 'silver' : 'bronze'
      state.setBallot(newBallot)
    } else {
      if (!state.ballot.players[index].medal){
         socket.emit('submit-final-vote', {
          player: index, 
          order: state.finalVoteIndex,
          room: state.room
        })
        state.setRoute('waiting')
        state.setFinalVoteIndex(0)
      } 
    }
}

  const onSubmitVote = (index) => {
    submitVote({
      index,
      name: state.player.name
    })
  }

  function submitVote(response){
    const room = state.room 
    socket.emit('submit-vote', {response, room }) 
    state.setRoute('waiting')
  }


  return (            
     	<div className="playerAppContainer">
         <div className="playerBackgroundContainer">
          <Background />
        </div>
        <div className="playerAppContentContainer">
        {state.route === 'game-over' && <GameOver restartGame={restartGame} />}
        {state.route === 'welcome' && <Join joinRoom={joinRoom} />}
        {state.route === 'waiting-start' && <Waiting title="Waiting" onAction={onStartGame} action="Evenyone's in"/>}
        {state.route === 'waiting' && <Waiting title="Waiting"/>}
        {state.route === 'answer-input' && <AnswerInput onSubmit={onSubmitResponse} />}
        {state.route === 'final-answer-input' && <FinalAnswerInput onSubmit={onSubmitFinalResponse} />}
        {state.route === 'vote' && <Vote name={state.player.name} onSubmit={onSubmitVote} {...state.ballot}/>}
        {state.route === 'final-vote' && <Vote name={state.player.name} onSubmit={onSubmitFinalVote} {...state.ballot}/>}
        </div>
       
     	</div>
  );
}

export default Player;

