import React, { useState } from "react";
import { Provider } from "./context";
import initialState from './initialState'
import Player from './index'
const ProviderComponent = props => {  
  const [player, setPlayer] = useState(initialState.player);
  const [room, setRoom] = useState(initialState.room);
  const [route, setRoute] = useState(initialState.route);
  const [round, setRound] = useState(initialState.round);
  const [gifIndex, setGifIndex] = useState(initialState.round);
  const [ballot, setBallot] = useState(initialState.ballot);
  const [finalVoteIndex, setFinalVoteIndex] = useState(initialState.finalVoteIndex);


  return (
     <Provider
        value={{
          player, 
          setPlayer, 
          room, 
          setRoom,
          route,
          setRoute,
          round,
          setRound,
          gifIndex,
          setGifIndex,
          ballot,
          setBallot,
          finalVoteIndex,
          setFinalVoteIndex
        }}
      >
       <Player />
    </Provider>
  );
};

export default ProviderComponent;