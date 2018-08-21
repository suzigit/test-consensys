pragma solidity ^0.4.18;

import "./IERC20Token.sol";

/**
 * @title TradeableContract
 * @dev Contract that represent a Wallet, whose ownership can be traded (sell/buy).
 * This contract can be used to receive ERC20 tokens, and has a specific function to withdraw these tokens. 
 */
contract TradeableContract {
    
	address public owner;

	uint128 public priceToSellInWei;

  /**
   * @dev Represent the info if the contract is available to sell or not. 
   * I could have used price as int and not used this field. It could assume -1 is the contract is not available to sell. 
   * However, it is safer to treat price always as uint.  
   */	
	bool public isAvailableToSell;

	event NewOwnerEvent(address old, address current);
	event WithdrawTokensEvent(address tokenAddr, address owner, uint256 value, bool sucess);
	event AvaliableToSellEvent(address owner, address contractAddr);
	event KillEvent();

	modifier onlyOwner {
		require(msg.sender == owner); 	
		_;
	}		

  /**
   * @dev Create a new contract. 
   * @param ownerAddr - is going to be the owner of this contract. 
   * It emits an event with the new onwer. Since there is no old owner, it is represented by 0x0.  
   */
	function TradeableContract (address ownerAddr) public {
		owner = ownerAddr;
		NewOwnerEvent(0x0,owner);
	}


  /**
   * @dev Kill the contract and trasfer funds to its owner. It is also emit a KillEvent.
   * It can only be called by the owner.   
   */
	function kill() public onlyOwner {
		KillEvent();	
		selfdestruct(owner);
	}


  /**
   * @dev Return the current owner of this contract.
   */	
	function getOwner() public view returns (address) {
		return owner;
	}

  /**
   * @dev Return the price for sell this contract, in Wei. 
   * If the current owner does not put it for sale, the returned value is going to be -1.
   * @return -  price in Wei or -1.
   */
	function getPriceToSellInWei() public view returns (int256) {		
		if (isAvailableToSell) {
			return priceToSellInWei;
		}  
		return -1;
	}


  /**
   * @dev Transfer tokens to the owner of its contract. 
   * It is necessary to call the transfer function of the original ERC20 contract code.
   * It emits an event representing the withdraw. 
   * It can only be called by the owner.
   * 
   * @param tokenAddr - IERC20 address of tokens to be transfered.
   * @param value - value of tokens to be withdraw.
   * @return - bool from the transfer function in the ERC-20 token.
   */
 	function withdrawTokens (address tokenAddr, uint256 value) public onlyOwner returns (bool) {

		bool b = IERC20Token(tokenAddr).transfer(owner,value);

		WithdrawTokensEvent(tokenAddr, owner, value, b);

		return b;

 	}


   /**
	* @dev Transfer all Ether held by the contract to the owner. 
	* It is necessary to avoid lock funds the were send (by mistake) to the contract and were not used.
    * It can only be called by the owner.
	*/
	function reclaimEther() external onlyOwner {
		owner.transfer(address(this).balance);
	}


   /**
	* @dev Indicate that this contract is available to sell.
    * It can only be called by the owner.
	* It emits an event in order to allow anyone to monitor new opportunities to buy.
	* @param priceInWei - price that the owner wants to sell this contract (in Wei) 
	*/
 	function setAvailableToSell (uint128 priceInWei) public onlyOwner {
		isAvailableToSell = true;
		priceToSellInWei = priceInWei;
		AvaliableToSellEvent(owner, address(this));
	}

   /**
	* @dev Change the ownership of this contract. It happens when someone buys an available to sell contract.
	* This functions is payable - It should receive necessary money to cover the contract price.
	* This function follows the pattern Checks-Effects-Interactions in order to avoid reentrancy attacks. 
	* In this function, the ownership is changed, the old owner receives what price in Wei he asked for 
	* and a fee is collected. 
	* It emits an event with the old and new owners.
	*/
 	function changeOwnershipWithTrade () payable public  {

		//Checks-Effects-Interactions pattern

        // CHECK - calculating values to transfer 
 	    require (isAvailableToSell==true);
 	    require (msg.value >= priceToSellInWei);     

		//EFFECTS
        address oldOwner = owner;      
        owner = msg.sender;
    	NewOwnerEvent(oldOwner, owner); 	
		
        isAvailableToSell = false;
        address feeAddress = 0x627306090abaB3A6e1400e9345bC60c78a8BEf57;
        
        uint128 feeValueInWei = priceToSellInWei/20;
        uint128 valueToOwnerInWei = priceToSellInWei-feeValueInWei;

		priceToSellInWei = 0; //Avoid reentrancy attack

		//INTERACTION
        feeAddress.transfer(feeValueInWei);
        oldOwner.transfer(valueToOwnerInWei);

 	}

} 

