import './App.css';
import * as fcl from "@onflow/fcl"
import * as types from "@onflow/types"
import parse from 'html-react-parser'

import {useState, useEffect} from 'react';

import { guessTx, viewSvgStringScript, resetTx, viewSvgKeyboardScript} from "./transactions/code.js"

fcl.config()
  .put("accessNode.api", "https://access-testnet.onflow.org")
  .put("discovery.wallet", "http://fcl-discovery.onflow.org/testnet/authn")

// 0xcaf735a7582f9b4c

function App() {
  const [user, setUser] = useState();
  const [scriptResult, setScriptResult] = useState([]);
  const [keyboardScriptResult, setKbScriptResult] = useState([]);
  const [text, setText] = useState(""); 

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
    const response = await fcl.send([
      fcl.transaction(guessTx),
      fcl.args([
      fcl.arg(text[0], types.String),
      fcl.arg(text[1], types.String),
      fcl.arg(text[2], types.String),
      fcl.arg(text[3], types.String),
      fcl.arg(text[4], types.String),
    ]),
    fcl.payer(fcl.authz),
    fcl.proposer(fcl.authz),
    fcl.authorizations([fcl.authz]),
    fcl.limit(9999)]).then(fcl.decode);

    const transaction = await fcl.tx(response).onceSealed()
    console.log(transaction)

    viewSvgString()
    viewSvgKeyboard()
  }

  const wrapperFunction = () => {
    viewSvgString()
    viewSvgKeyboard()
  }

  const viewSvgString = async () => {
    const result = await fcl.send([
      fcl.script(viewSvgStringScript),
      fcl.args([
        fcl.arg(user.addr, types.Address)
      ])
    ]).then(fcl.decode);
    setScriptResult(result);
    console.log(result);
  }

  const viewSvgKeyboard = async () => {
    const result = await fcl.send([
      fcl.script(viewSvgKeyboardScript),
      fcl.args([
        fcl.arg(user.addr, types.Address)
      ])
    ]).then(fcl.decode);
    setKbScriptResult(result);
    console.log(result);
  }

  const reset = async () => {
    const response = await fcl.send([
      fcl.transaction(resetTx),
      fcl.args([]),
    fcl.payer(fcl.authz),
    fcl.proposer(fcl.authz),
    fcl.authorizations([fcl.authz]),
    fcl.limit(9999)]).then(fcl.decode);
    const transaction = await fcl.tx(response).onceSealed()
    console.log(transaction)

    viewSvgString()
  }

  return (
    <div className="App">
        <h1>flowrdle</h1>
        {user && user.addr ? <h1>account: {user.addr}</h1> : null}
      <div>
        <button onClick={() => logIn()}>Log In</button>
        <button onClick={() => logOut()}>Log Out</button>
        
        <button onClick={() => wrapperFunction()}>View Board</button>
        <button onClick={() => reset()}>Start Over</button>
      </div>

      <div>
        <input type="text" name="Number" onChange={e => setText(e.target.value)}/>
        <button onClick={() => guess()}>Guess</button>
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        {scriptResult.length !== 0 ? parse(scriptResult) : null}
        {keyboardScriptResult.length !== 0 ? parse(keyboardScriptResult) : null}
      </svg>

    </div>

  );
}

export default App;