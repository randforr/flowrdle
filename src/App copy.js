import './App.css';
import * as fcl from "@onflow/fcl"
import * as types from "@onflow/types"

import {useState, useEffect} from 'react';

import { guessTx, viewScript } from "./transactions/code.js"

fcl.config()
  .put("env", "testnet")
  .put("accessNode.api", "https://access-testnet.onflow.org")
  .put("discovery.wallet", "http://fcl-discovery.onflow.org/testnet/authn")

// 0xcaf735a7582f9b4c

function App() {
  const [user, setUser] = useState();
  const [scriptResult, setScriptResult] = useState();

  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
  }, [])

  const logIn = () => {
    fcl.authenticate();
  }

  const logOut = () => {
    fcl.unauthenticate();
  }

  const guess = async () => {
    const transactionId = await fcl.send([
      fcl.transaction(guessTx),
      fcl.args([
      fcl.arg("r", types.String),
      fcl.arg("i", types.String),
      fcl.arg("v", types.String),
      fcl.arg("e", types.String),
      fcl.arg("t", types.String),
    ]),
    fcl.payer(fcl.authz),
    fcl.proposer(fcl.authz),
    fcl.authorizations([fcl.authz]),
    fcl.limit(9999)]).then(fcl.decode);

    console.log(transactionId)
  }

  const viewVars = async () => {
    const result = await fcl.send([
      fcl.script(viewScript),
      fcl.args([
        fcl.arg(user.addr, types.Address)
      ])
    ]).then(fcl.decode);
   // setScriptResult(result);
    console.log(result);
  }

  return (
    <div className="App">
        {user && user.addr ? <h1>{user.addr}</h1> : null}
        <button onClick={() => logIn()}>Log In</button>
        <button onClick={() => logOut()}>Log Out</button>
        <button onClick={() => guess()}>Guess</button>
        <button onClick={() => viewVars()}>View</button>
    </div>

  );
}

export default App;