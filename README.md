Have you already transfer tokens? What about transfer your wallet with all you have within?
How can we do that in a TRUSTLESS way? This project  - Tradeable Wallet - is the solution to that.

Why it is useful?
-----------------
This project was created with a specific scenario in mind. Imagine you have bought some tokens during an ICO. You registered your address in the SAFT contract (or, in a Pool e.g. Primablock). But now you have to wait some days or even months before receive your tokens. If you had used the Tradeable Wallet you can sell your tokens EVEN BEFORE receive them. It works in a TRUSTLESS WAY, i.e., the peers do not need to trust each other in order to do trading.
The magic is: The tradeable wallet is a Ethereum Smart Contract. The tokens (from the ICO) are going to be send to the address of your Tradeable Wallet. The Smart Contract has functions to sell/buy. At any time, the owner of the wallet can also withdraw the received tokens.


User Stories:
-------------
As an ICO investor, I can open the web app using Metamask. The GUI recognizes the selected Ethereum address and show me a set of possibilities. I can create a new Tradeable Wallet and see its Ethereum address.

I can use its address to indicate where I am going to receive my future tokens. Then, I can put my wallet for sale. Or wait and, after receive my tokens, withdraw them, i.e., transfer them from my Tradeable Wallet to my personal Ethereum address.

I can also buy Tradeable Wallets created by other ICO investors. The trade is perfomed in a TRUSTLESS way.
At any time, I can see information related to my Tradeable Wallets, like all withdraws and past owners.


See the App
-----------

You can access the app at: https://tradeable-wallet.herokuapp.com/
You have to use Metamask at Rinkeby. 

You have to create a Tradeable Wallet before try to use withdraw from it or put it for sale. You can try to buy my Tradeable Wallet. 
I am selling the following Tradeable Wssallets (maybe it is already selled when you try):

xxxxxxxxxxxxxxxxxs

To test the withdraw functionality you can use the following ERC20 token: xxxxxxxxxxxxxxxxxx. You have to send tokens to your Tradeable Wallet before use the withdraw functionality (or you can try to do a withdraw of 0 tokens -- available in the test ERC20 token for convenience).

The Contract Creator is available at: xxxxxxxxxxxxxxxx



How to set it up
----------------

This is the official repository: https://github.com/suzigit/tradeable-wallet.git 

There are two folders at the first level of the source code: front (Angular 4) and back-blockchain.

If you want to set it up locally, you must first set your environment. If you still do not have, install truffle, ganache and metamask.

Use truffle development configuration (see truffle.js) to run the contract on localhost at 8545. Configure Metamask to the same network, assuring you have ether in your accounts. When migrating the contracts, take note of the address of ContractCreator and TokenERC0_Mock.

In order to run the front end you first need to configure your contract address at src/app/constansts.json. Change the variable "ContractCreatorAddr" to what you got during migration. You are going to need TokenERC0_Mock addr to test the withdraw functionality.

To run Angular, you need to generate the node_modules do npm install inside the folder called front. 
Then, use: 
- npm start to generate all compiled front files and serve it at localhost:8080 or   
- install angular cli (npm install -g @angular/cli) and load in development mode using "ng serve". See the app at localhost:4200.

See information about how to set up a Dapp with Angular front-end at: https://truffleframework.com/boxes/angular-truffle-box.


Unit tests
-----------

There are two set of tests - one to each smart contract. Note that there are no tests to contracts developed with mocking purposes.

* Tradeable Wallet tests -> the most important issues are the 3 main functinalities - withdraw, sell and buy. The tests cover:
- owner is who is supposed to be (in order to check the initial setup)
- only the contract owner can withdraw tokens (two tests to assure this)
- the contract owner can put his wallet(=tradeable wallet) for sale
- any user can buy a wallet if and only if the owner put this wallet for sale and this user provide enough money. (three tests to assure this)

* Contract Creator tests -> the most important issues to test are ownership, contract creation and circuit breaker. The tests cover:
- owner is who is supposed to be (in order to check the initial setup)
- any user can create new Tradeable Wallets and its creation is reflected in view functions (getContractCount, getContracts) 
- it is possible to turn circuir breaker on, avoiding the creation of new Tradeable Wallets.



Integration with existing services - future plans
-------------------------------------------------

This project can be expanded in the future to integrate with existing services on Ethereum. For example:

a) ENS (Ethereum Name Service) - It could be included an option during the Wallet creation to create a Tradeable Wallet (=Smart Contract) with support to Namehashs. It should be an option (and not the unique option) since this kind of contract would have more functions and is going to consume more gas to create and do other functionalities.

b) IPFS - It could be included the possibility of annex an evidence that the Tradeable Wallet address is really going to be the place where the user is going to receive the ERC-20 tokens, in the future. The user can use the app to upload a doc to IPFS and the hash could be stored at her/his Tradeable Wallet.

c) Oracle - It could be interesting to have an oracle service of personal reputation, a kind of social score. This will only address the issue that the wallet owner could try to change actual arrangements in order to receive the future tokens in other address. For example, the user can create a Tradeable Wallet, include it on SAFT (a kind of ICO contract) and, after selling the Wallet, try to change the used address making an agreement with the ICO development team. We also have other ideas that is going to mitigate this risk.
