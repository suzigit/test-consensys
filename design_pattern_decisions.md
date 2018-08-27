This doc explains why I chose to use the design patterns that I did

(1) I used **Factory** pattern in  _ContractCreator_ to create multiple instances of _TradeableContract_. See the explanation here: https://ethereum.stackexchange.com/questions/13415/deploy-contract-from-contract-in-solidity.
The main smart contract is _TradeableContract_. Its implementation enables TRUSTLESS sell & buy functions.  _ContractCreator_ was created in order to be more transparent about the _TradeableContract_ already created. One could argue that _ContractCreator_ is not necessary and the front-end could create the  _TradeableContract_. It is indeed an option. However, I decided to have a _ContractCreator_ as a way to show all users what are _TradeableContract_ already deployed. It can help to increase the TRUST in the overall solution.

(2) **Upgradability**
I added an interface _ITradeableContract_ to help with upgradability. The idea is, over time, new kind of _TradeableContract_ may exist. 
For example, the actual implementation of _ITradeableContract_ assumes that the token must be an ERC-20, the calculation of fee is fixed. The fee must be sent to a fixed address. Future implementations may have different business rules but will probabily follow the same interface. The front-end only depends on _ITradeableContract_, and not on its implementation.
Also, I added a function _getContractAt_ to retrive the set of contracts stored in _ContractCreator_. It will help when upgrading this contract.

(3) **Lib with Factory pattern**
Reducing the size of the _TradeableContract_  may save a lot of gas in deployment costs over the lifetime of the contract. Moving functions that are referenced by the _TradeableContract_ to a library can reduce the its size.
However, calling library functions from the _TradeableContract_ is a bit more expensive than calling internal functions, so there is a tradeoff to consider. In the future, I intend to test if is worth to extract some parts of _TradeableContract_ to a lib. I have to calculate considering the specific use of the proposed solution. If necessary, I can do the upgradability, as explained in (2).

(4) **Circuit Breaker**. There is a Ciruit Breakear implementation at _ContractCreator_. If something bad happens, we can pause the creation of new contracts. It can also help when upgrading the solution to add/change features in the Tradeable Wallet - as discussed at (2).  I did not implemented a Circuit Breaker at _ITradeableContract_ because it is almost the same as the variable _isAvailableToSell_. The functions that are not covered by _isAvailableToSell_ are only available to the owner and protected by _onlyOwner_ modifier. Since a circuit would use the same modifier, a vulnerability in these functions can also impact the circuit breaker itself.

(5) **Fail early and fail loud**
The necessary conditions to execute functions are checked in th beginning of the developed functions using require. E.g. _require(msg.value >= priceToSellInWei)_

(6) **Restricting Access**
Some functions can only be invoked by the contract owner. It was implemented by using the modifier _onlyOwner_ at  _ContractCreator_ and _TradeableContract_.

(7) **Mortal**
The ability to destroy the contract and remove it from the blockchain was NOT implemented at _TradeableContract_. I believe this function could introduce a big operational risk. If any token is not delivered yet and the owner destroy the wallet, he is going to lock his tokens forever. The benefit of save gas when the owner not need the contract anymore is not enough to justify this risk. Also, the cost of the  _TradeableContract_ would cost more gas with this function.

(8) **High-level external call prefered**. The external calls in _makeUntrustedWithdrawalOfTokens_ function (_TradeableContract_) could be done in low-level (call) or high-level (contract calls e.g., _ExternalContract.doSomething()_ ). I adopted high-level for two reasons. (a) because it is easiest to code and undestand and (b) because in this case is desirable that the function fails if the external call fails.




   * It is marked as untrusted since this smart contract cannot trust the original code of the ERC-20 token.


(5) It is a best practice that in 2-party or N-party contracts, the developer should beware of the possibility that **some participants may "drop offline"** and not return. The Tradeable Contract follow this recommendation by segregating in two functions a trade operation. There a function to be invoked by the seller and a later function to be invoked by the buyer.


(7) **Web3 layer**. Every comunication front-end x blockchain is concentrated at class src/app/service/blockchain-service.ts. This layer was created in order to easily change the way the communication takes place. For example, I choose to use web3 1.0 beta. But, if I had found a bug (since it is still in beta), I could have changed to use web3 version 0.2. It also helps to accomodate function name changes.

(8) **Listening for Selected Account Changes**. The front-end shows what is the selected account by following Metamask pattern as documented at: https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md.  It was adapted to web 3 1.0.

(9) **Network check**. The front-end shows what the network the user is in using by following Metamask pattern as documented at: https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md. It was adapted to web 3 1.0.  



https://consensys.github.io/smart-contract-best-practices/recommendations/

open issues: 
Comentar sobre fee fixo
