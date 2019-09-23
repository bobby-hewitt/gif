import React, { useState } from "react";
import { Provider } from "./context";
import initialState from './initialState'

const ProviderComponent = props => {
  const [player, setPlayer] = useState(initialState.player);
  const [test, setTest] = useState(initialState.test);
  const [host, setHost] = useState(initialState.host);
  return (
   <Provider
      value={{
        player, setPlayer, host, setHost, test, setTest
      }}
    >
      {props.children}
    </Provider>
  );
};

export default ProviderComponent;