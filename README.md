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


How to set it up
----------------




Tests
-----
There are two set of tests - one to each smart contract. Note that there are no tests to mock contracts.

* Tradeable Wallet tests -> the most important issues are the 3 main functinalities - withdraw, sell and buy. The tests cover:
- owner is who is supposed to be (in order to check the initial setup)
- only the contract owner can withdraw tokens (two tests to assure this)
- the contract owner can put his wallet(=tradeable wallet) for sale
- any user can buy a wallet if and only if the owner put this wallet for sale and this user provide enough money. (three tests to assure this)

* Contract Creator tests -> the most important issues to test are ownership, contract creation and circuit breaker. The tests cover:
- owner is who is supposed to be (in order to check the initial setup)
- any user can create new Tradeable Wallets and its creation is reflected in view functions (getContractCount, getContracts) 
- it is possible to turn circuir breaker on, avoiding the creation of new Tradeable Wallets.



