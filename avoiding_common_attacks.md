This doc explains what measures I took to ensure that my contracts are not susceptible to common attacks.

ver pagina common atacks



(1) *Use of transfer, instead of send or call* in the _changeOwnershipWithTrade_ because:
- call is not a safe option against reentrancy, since the executed code is given all available gas for execution
- send and transfer are considered safe against reentrancy. While these methods still trigger code execution, the called contract is only given a stipend of 2,300 gas which is currently only enough to log an event. _x.transfer(y)_ is equivalent to _require(x.send(y))_;, it will automatically revert if the send fails. Since it is desirable that _untrustedChangeOwnershipWithTrade_ (from _TradeableContract_) fails if the operation fails, transfer is a better option.

(2) *Use of avoiding state changes after external calls*. In the _TradeableContract_ it is true at the following functions: _makeUntrustedWithdrawalOfTokens_ and _untrustedChangeOwnershipWithTrade_. The function _makeUntrustedWithdrawalOfTokens_ has an addition line after the external call to emit an event. It is worth to mention that it is not a state change. 

(3) Use of *favor pull over push payment*. The function _makeUntrustedWithdrawalOfTokens_ does it with a simple code. Push payments would require for example listen events of ERC-20 token and invoke a way of push payments. This technique minimizes the damage caused by payment failures. It is often better to isolate each external call into its own transaction that can be initiated by the recipient of the call. The function  





(2) Use of unsigned int for representing prices values.
Avoid the complexity of deal with negative number for representing prices.  

(4) The function untrustedChangeOwnershipWithTrade (from Tradeable Contract) calculates a fee to be charged from the buyer. It does not use multiplication operation in order to avoid integer overflow. 

(3) I also took a look at infrastructure bugs to avoid them. The description of bugs are at: https://solidity.readthedocs.io/en/develop/bugs.html
Many of this bugs does not happen at solidity 0.4.23, version of language that I used. The unique know bug that can happen at this version is 
**EventStructWrongData** - I avoid by not using struct in events. When emitting an event, I passed many arguments, but not a struct.






There is an attack to consider t

 

https://consensys.github.io/smart-contract-best-practices/recommendations/