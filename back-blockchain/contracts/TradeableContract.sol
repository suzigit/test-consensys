pragma solidity ^0.4.23;

import "./IERC20Token.sol";
import "./ITradeableContract.sol";

/**
 * @title TradeableContract
 * @dev Contract that represent a Wallet, whose ownership can be traded (sell/buy).
 * This contract can be used to receive ERC20 tokens. 
 */
contract TradeableContract is ITradeableContract {
    
  /**
   * @dev Assure that only the owner can invoke a function.   
   */
	modifier onlyOwner {
		require(msg.sender == owner); 	
		_;
	}		


  /**
   * @dev Owner of this contract.   
   */	
	address public owner;

  /**
   * @dev Price of this contract (the information is only valid if and only if the contract is available to sell.   
   */
	uint128 public priceToSellInWei;

  /**
   * @dev Represent the info if the contract is available to sell or not. 
   * I could have used price as int and not used this field. It could assume -1 is the contract is not available to sell. 
   * However, it is safer to treat price always as uint.  
   */	
	bool public isAvailableToSell;

  /**
   * @dev Hash to the description of this contracts.    
   * The description itself is stored off-chain.  
   * It can be used during sell-buy transactions.
   */	
	string public hashToDescription;


  /**
   * @dev Denominator to be used to caculate fee. 
   * The fee value is calculated by priceToSellInWei/denominatorFee.
   * Should be a number between >1 and <100
   */	
	uint8 public denominatorFee;


  /**
   * @dev Create a new contract. 
   * @param ownerAddr is going to be the owner of this contract. 
   * It emits an event with the new onwer. Since there is no old owner, it is represented by 0x0.  
   */
	constructor (address ownerAddr) public {
		owner = ownerAddr;
		denominatorFee = 40;
		emit NewOwnerEvent(0x0,owner);
	}


  /**
   * @dev Return the current owner of this contract.
   * @return the owner of this contract.
   */	
	function getOwner() external view returns (address) {
		return owner;
	}

  /**
   * @dev Return the hash description of this contract.
   * @return the hash to the description of this contract.
   */	
	function getHashDescription() external view returns (string) {
		return hashToDescription;
	}

  /**
   * @dev Returns denominator to be used in the calculation of fee value
   * The fee value is calculated by price (in Wei)/(denominator fee).
   * @return Denominator to calculate fee value 
   */
	function getDenominatorFee() view external returns (uint8) {
		return denominatorFee;
	}

  /**
   * @dev Change the hash to the description to this wallet
   * @param hDescription new hash description to this wallet.
   */	
	function changeHashDescription(string hDescription) external onlyOwner {
		hashToDescription = hDescription;
	}

  /**
   * @dev Return the price for sell this contract, in Wei. 
   * If the current owner does not put it for sale, the returned value is going to be -1.
   * @return price in Wei or -1.
   */
	function getPriceToSellInWei() external view returns (int256) {		
		if (isAvailableToSell) {
			return priceToSellInWei;
		}  
		return -1;
	}


   /**
	* @dev Indicate that this contract is available to sell.
	* It can only be called by the owner.
	* It emits an event in order to allow anyone to monitor new opportunities to buy.
	* @param priceInWei Price that the owner wants to sell this contract (in Wei)
	* @param hDescription Hash to the description of this contract 
	*/
 	function setAvailableToSell (uint128 priceInWei, string hDescription) external onlyOwner {
		isAvailableToSell = true;
		priceToSellInWei = priceInWei;
		hashToDescription = hDescription;
		emit AvaliableToSellEvent(owner, address(this));
	}

   /**
	* @dev Change the ownership of this contract. It happens when someone buys an available to sell contract.
	* This functions is payable - It should receive necessary money to cover the contract price.
	*
    * This function is marked as untrusted since this smart contract cannot trust the oldOwner code during the transfer.
    * It executes the external calls as the last steps in order to avoid attacks.
	* FeeAddress is a well-know and safe address, so it must happen before the transfer to the oldOwner.
    * It is important to note that who is going to invoke this function can see the oldOwner code before. 
	*
	* This function follows the pattern Checks-Effects-Interactions in order to avoid reentrancy attacks. 
	* In this function, the ownership is changed, the old owner receives what price in Wei he asked for 
	* and a fee is collected. 
	* It emits an event with the old and new owners.
	*/
	function untrustedChangeOwnershipWithTrade () payable external  {

		//Checks-Effects-Interactions pattern

		// CHECK - calculating values to transfer 
		require (isAvailableToSell==true);
		require (msg.value >= priceToSellInWei);     
//		assert (denominatorFee > 1 && denominatorFee < 100);

		//EFFECTS
		address oldOwner = owner;      
		owner = msg.sender;
		emit NewOwnerEvent(oldOwner, owner); 	

		isAvailableToSell = false;

		//The option was to transfer to a constant address
		//If this option was receive this address, someone atack by indicating other address 
		address feeAddress = 0xE4aaA0FC768FbBaFAa15f3cf16530b1D082a95b0;

		// All integer division rounds down to the nearest integer. 
		// Then, the charged fee when someone buy a contract is, AT MOST, 5%.
		uint128 feeValueInWei = priceToSellInWei/denominatorFee;
		uint128 valueToOwnerInWei = priceToSellInWei-feeValueInWei;

		priceToSellInWei = 0; //Avoid reentrancy attack

		//INTERACTION
		feeAddress.transfer(feeValueInWei);
		oldOwner.transfer(valueToOwnerInWei);

	}

   /**
	* @dev Since this contract represents a wallet it is worth to enable the possibility to receive ether.
	*/
	function() payable external { 
		
		//avoid receive funds when someone just entered a wrong function name
		require(msg.data.length == 0); 
		
		emit DepositReceivedEvent(msg.sender); 
	}


  /**
   * @dev Transfer tokens to the owner of its contract. 
   * It is necessary to call the transfer function of the original ERC20 contract code.
   *
   * This function is marked as untrusted since this smart contract cannot trust the original code of the ERC-20 token.
   * It executes the external call as the last step in order to avoid attacks.
   * It is important to note that who is going to invoke this function can see the tokenAddr before. 
   *
   * It emits an event representing the withdraw. 
   * It can only be called by the owner.
   * 
   * @param tokenAddr IERC-20 address of tokens to be transfered.
   * @param value Value of tokens to be withdraw.
   * @return bool from the transfer function in the ERC-20 token.
   */
	function makeUntrustedWithdrawalOfTokens (address tokenAddr, uint256 value) external onlyOwner returns (bool) {

		bool b = IERC20Token(tokenAddr).transfer(owner,value);
		
		emit TransferTokensEvent(tokenAddr, owner, value, true, b);

		return b;

	}

  /**
   * @dev Transfer ether from external contracts to the owner of its contract. 
   *
   * This function is marked as untrusted since this smart contract cannot trust external calls.
   * It does not return any value, throwing an exception in case of failure.
   *
   * It should emit an event representing the withdraw. 
   * It should only be called by the owner.
   * 
   * @param valueInWei Value of ether to be withdraw (in Wei).
   */
	function makeUntrustWithdrawOfEther(uint256 valueInWei) external onlyOwner {
		
		require (address(this).balance >= valueInWei);

		emit TransferETHEvent(owner, valueInWei, true);

		//Since it is Ether, the Ethereum plataform takes care of reentrancy attacks
		owner.transfer(valueInWei);
	}

  /**
   * @dev Transfer tokens from this contract to an external account. 
   *
   * This function is marked as untrusted since this smart contract cannot trust external calls.
   *
   * It should emit an event representing the transfer. 
   * It should only be called by the owner.
   * 
   * @param tokenAddr IERC-20 address of tokens to be transfered.
   * @param to address to be transfered.
   * @param value Value of tokens to be transfered.
   */
	function makeUntrustedTokenTransferToOutside(address tokenAddr, address to, uint256 value) external onlyOwner returns (bool) {

		//Did not check the same require as makeUntrustedEtherTransferToOutside in order to avoid 
		//introducing any noise in the communication wih the ERC-20 token.
		//For example, maybe there is a semantic related to do a transfer to itself in the token contract. 

		bool b = IERC20Token(tokenAddr).transfer(to,value);
		
		emit TransferTokensEvent(tokenAddr, to, value, false, b);

		return b;

	}


  /**
   * @dev Transfer Ether from this contract to an external account. 
   *
   * This function is marked as untrusted since this smart contract cannot trust external calls.
   * It does not return any value, throwing an exception in case of failure.
   *
   * It should emit an event representing the transfer. 
   * It should only be called by the owner.
   * 
   * @param to address to be transfered.
   * @param valueInWei Value of ether to be transfered.
   */
	function makeUntrustedEtherTransferToOutside(address to, uint256 valueInWei) external onlyOwner {

		require(to != address(0x0));
        require(to != address(this));
        require (address(this).balance >= valueInWei);

		emit TransferETHEvent(to, valueInWei, false);

		//Since it is Ether, the Ethereum plataform takes care of reentrancy attacks
		to.transfer(valueInWei);

	}

  /**
   * @dev Return the ether balance of this contract. 
   * @return ether balance of this contract
   */
	function getEtherBalance () external view returns (uint256) {
	    return address(this).balance;
	}
	
	
  /**
   * @dev Return the token balance of this contract.
   * @param tokenAddr the address of the token which balance will be returned 
   * @return token balance of this contract
   */
	function getTokenBalanceOf (address tokenAddr) external view returns (uint256){
		return IERC20Token(tokenAddr).getBalanceOf(this);		
	}


} 