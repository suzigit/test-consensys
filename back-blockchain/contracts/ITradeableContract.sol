pragma solidity ^0.4.23;

/**
 * @title ITradeableContract
 * @dev Contract that represent a Wallet, whose ownership can be traded (sell/buy).
 * This contract can be used to receive tokens, and has a specific function to withdraw these tokens. 
 */
interface ITradeableContract {

  /**
   * @dev Event to inform a new owner of this Contract. 
   * When the contract is created, it is fired with the old owner 0x0.    
   */ 
	event NewOwnerEvent(address old, address current);
	
  /**
   * @dev Event to inform a new withdraw of this contract. 
   */ 
	event WithdrawTokensEvent(address tokenAddr, address owner, uint256 value, bool sucess);
	
  /**
   * @dev Event to inform that one contract became available to sell. 
   */ 
	event AvaliableToSellEvent(address owner, address contractAddr);

  /**
   * @dev Return the current owner of this contract.
   * @return the owner of this contract.
   */	
	function getOwner() view external returns (address);

  /**
   * @dev Return the hash description of this contract.
   * @return the hash to the description of this contract.
   */	
	function getHashDescription() external view returns (string);

  /**
   * @dev Change the hash to the description to this wallet.
   * @param hDescription new hash description to this wallet.
   * It should only be called by the owner.
   */	
	function changeHashDescription(string hDescription) external;

  /**
   * @dev Return the price for sell this contract, in Wei. 
   * If the current owner does not put it for sale, the returned value is going to be -1.
   * @return price in Wei or -1.
   */
	function getPriceToSellInWei() external view returns (int256);

  /**
   * @dev Returns denominator to be used in the calculation of fee value
   * The fee value is calculated by price (in Wei)/(denominator fee).
   * @return Denominator to calculate fee value 
   */
	function getDenominatorFee() external view returns (uint8);


  /**
   * @dev Transfer tokens from external contracts to the owner of its contract. 
   *
   * This function is marked as untrusted since this smart contract cannot trust external calls.
   *
   * It should emit an event representing the withdraw. 
   * It should only be called by the owner.
   * 
   * @param tokenAddr address of tokens to be transfered.
   * @param value Value of tokens to be withdraw.
   * @return bool from the transfer function in tokenAddr.
   */
	function makeUntrustedWithdrawalOfTokens (address tokenAddr, uint256 value) external returns (bool);


   /**
    * @dev Transfer all Ether held by the contract to the owner. 
    * It is necessary to avoid lock funds the were send to the contract and were not used.
    * It should only be called by the owner.
    */
	function reclaimEther() external;


   /**
	* @dev Indicate that this contract is available to sell.
	* It should only be called by the owner.
	* It should emit an event in order to allow anyone to monitor new opportunities to buy.
	* @param priceInWei Price that the owner wants to sell this contract (in Wei)
	* @param hDescription Hash to the description of this contract 
	*/
 	function setAvailableToSell (uint128 priceInWei, string hDescription) external;

   /**
	* @dev Change the ownership of this contract. It happens when someone buys an available to sell contract.
	* This functions is payable - It should receive necessary money to cover the contract price.
	*
    * This function is marked as untrusted since this smart contract cannot trust the code of external calls.
	*
	* It should emit an event with the old and new owners.
	*/
	function untrustedChangeOwnershipWithTrade () payable external;

   /**
	* @dev Since this contract represents a wallet it is worth to enable the possibility to receive ether.
	*/
	function() payable external;

}
