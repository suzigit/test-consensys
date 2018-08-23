This doc explains why I chose to use the design patterns that I did

The external calls in makeUntrustedWithdrawalOfTokens function (Tradeable Contract) could be done in low-level (call) or high-level (contract calls e.g., ExternalContract.doSomething() ). I adopted high-level for two reasons. (a) because it is easiest to code and undestand and (b) because in this case is desirable that the function fails if the external call fails.

(3) The function makeUntrustedWithdrawalOfTokens favor pull over push payment. It is a simple solution. Push payments would require for example listen events of ERC-20 token and invoke a way of push payments. This technique minimizes the damage caused by payment failures. It is often better to isolate each external call into its own transaction that can be initiated by the recipient of the call.  

() It is a best practice that in 2-party or N-party contracts, the developer should beware of the possibility that some participants may "drop offline" and not return. The Tradeable Contract follow this recommendation by segregating in two functions a trade operation. There a function to be invoked by the seller and after a function to be invoked by the buyer.


Since solidity still do not support fixed-point type, the smart contract does fee calculating using division of integers. All integer division rounds down to the nearest integer. Then, the charged fee when someone buy a contract is 1/20, AT MOST, 5% of the price. The fee is calculated in Wei to minimize fee loss. 

1:n
Upgradability x rigidity -> I chose to stay simple and not focus on upgradability. 
Monolithic x modular -> ver pergunta

Mobile-friendly? ser adaptado para cyber...

Diminuir o tamanho do contrato Tradeable para minimizar gas? Discutir opções na documentação - lib

Comentar sobre fee fixo		



   * It is marked as untrusted since this smart contract cannot trust the original code of the ERC-20 token.
   * This function executes the external call as the last step in order to avoid attacks. 
   * It is important to note that who is going to invoke this function can see the tokenAddr before. 

https://consensys.github.io/smart-contract-best-practices/recommendations/
