import React, { useState } from "react";
import { Provider } from "./context";
import initialState from './initialState'
import Host from './index'
const ProviderComponent = props => {  
  const [players, setPlayers] = useState(initialState.players);
  const [host, setHost] = useState(initialState.host);
  const [route, setRoute ] = useState(initialState.route) 
  const [rounds, setRounds ] = useState(initialState.rounds) 
  const [round, setRound ] = useState(initialState.round) 
  const [responseIndex, setResponseIndex ] = useState(initialState.responseIndex) 
  const [showVotes, setShowVotes ] = useState(initialState.showVotes) 
  const [triggerReload, setTriggerReload ] = useState(false) 
  const [allFinalVotesIn, setAllFinalVotesIn ] = useState(false) 
  return (
     <Provider
        value={{
          players, 
          setPlayers, 
          host, 
          setHost,
          route,
          setRoute,
          rounds,
          setRounds,
          round,
          setRound,
          responseIndex,
          setResponseIndex,
          showVotes,
          setShowVotes,
          triggerReload,
          setTriggerReload,
          allFinalVotesIn,
          setAllFinalVotesIn
        }}
      >
       <Host />
    </Provider>
  );
};

export default ProviderComponent;