export const guessTx = `
import flowrdleTEST from 0xcaf735a7582f9b4c
transaction(l1: String, l2: String, l3: String, l4: String, l5: String) {

  prepare(acct: AuthAccount) {
  
    if acct.borrow<&flowrdleTEST.flowrdleGame>(from: /storage/flowrdleGame) == nil {
      let game <- flowrdleTEST.createFlowrdleGame()
      acct.save(<- game, to: /storage/flowrdleGame)
      acct.link<&flowrdleTEST.flowrdleGame>(/public/flowrdleGame, target: /storage/flowrdleGame)
    }

    let flowrdleGame = acct.borrow<&flowrdleTEST.flowrdleGame>(from: /storage/flowrdleGame)!
    flowrdleGame.processGuess(guessedLetter1: l1, guessedLetter2: l2, guessedLetter3: l3, guessedLetter4: l4, guessedLetter5: l5)

}

  execute {
    
  }
}
`

export const viewScript = `
import flowrdleTEST from 0xcaf735a7582f9b4c

pub fun main(account: Address): [String] {
  let info: [String] = []
  let flowrdleGame = getAccount(account).getCapability(/public/flowrdleGame).borrow<&flowrdleTEST.flowrdleGame>()!
  info.append(flowrdleGame.numOfGuesses.toString())
  info.append(flowrdleGame.svgString)
  return info
}
`

export const viewSvgStrng = `
import flowrdleTEST from 0xcaf735a7582f9b4c

pub fun main(account: Address): String {
  let flowrdleGame = getAccount(account).getCapability(/public/flowrdleGame).borrow<&flowrdleTEST.flowrdleGame>()!
  return flowrdleGame.svgString
}
`

export const resetTx = `
import flowrdleTEST from 0xcaf735a7582f9b4c
transaction() {

  prepare(acct: AuthAccount) {
  
    if acct.borrow<&flowrdleTEST.flowrdleGame>(from: /storage/flowrdleGame) == nil {
      let game <- flowrdleTEST.createFlowrdleGame()
      acct.save(<- game, to: /storage/flowrdleGame)
      acct.link<&flowrdleTEST.flowrdleGame>(/public/flowrdleGame, target: /storage/flowrdleGame)
    }

    let flowrdleGame = acct.borrow<&flowrdleTEST.flowrdleGame>(from: /storage/flowrdleGame)!
    flowrdleGame.resetGame()

}

  execute {
    
  }
}
`

