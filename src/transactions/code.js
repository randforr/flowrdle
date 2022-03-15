export const guessTx = `
import flowrdle from 0xcaf735a7582f9b4c
transaction(l1: String, l2: String, l3: String, l4: String, l5: String) {

  prepare(acct: AuthAccount) {
  
    if acct.borrow<&flowrdle.flowrdleGame>(from: /storage/flowrdleStoragePath) == nil {
      let game <- flowrdle.createFlowrdleGame()
      acct.save(<- game, to: /storage/flowrdleStoragePath)
      acct.link<&flowrdle.flowrdleGame>(/public/flowrdlePublicPath, target: /storage/flowrdleStoragePath)
    }
    
    let flowrdleGame = acct.borrow<&flowrdle.flowrdleGame>(from: /storage/flowrdleStoragePath)!
    flowrdleGame.processGuess(guessedLetter1: l1, guessedLetter2: l2, guessedLetter3: l3, guessedLetter4: l4, guessedLetter5: l5)

}

  execute {
    
  }
}
`

export const viewScript = `
import flowrdle from 0xcaf735a7582f9b4c

pub fun main(account: Address): [String] {
  let info: [String] = []
  let flowrdleGame = getAccount(account).getCapability(/public/flowrdlePublicPath).borrow<&flowrdle.flowrdleGame>()!
  info.append(flowrdleGame.numOfGuesses.toString())
  info.append(flowrdleGame.svgString)
  return info
}
`

export const viewSvgStringScript = `
import flowrdle from 0xcaf735a7582f9b4c

pub fun main(account: Address): String {
  let flowrdleGame = getAccount(account).getCapability(/public/flowrdlePublicPath).borrow<&flowrdle.flowrdleGame>()!
  return flowrdleGame.svgString
}
`

export const resetTx = `
import flowrdle from 0xcaf735a7582f9b4c
transaction() {

  prepare(acct: AuthAccount) {
  
    if acct.borrow<&flowrdle.flowrdleGame>(from: /storage/flowrdleStoragePath) == nil {
      let game <- flowrdle.createFlowrdleGame()
      acct.save(<- game, to: /storage/flowrdleStoragePath)
      acct.link<&flowrdle.flowrdleGame>(/public/flowrdlePublicPath, target: /storage/flowrdleStoragePath)
    }

    let flowrdleGame = acct.borrow<&flowrdle.flowrdleGame>(from: /storage/flowrdleStoragePath)!
    flowrdleGame.resetGame()

}

  execute {
    
  }
}
`

export const viewSvgKeyboardScript = `
import flowrdle from 0xcaf735a7582f9b4c

pub fun main(account: Address): String {
  let flowrdleGame = getAccount(account).getCapability(/public/flowrdlePublicPath).borrow<&flowrdle.flowrdleGame>()!
  return flowrdleGame.keyboardSvg
}
`