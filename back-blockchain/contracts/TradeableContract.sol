pragma solidity ^0.4.18;

import "./IERC20Token.sol";

contract TradeableContract {
    
	address public owner;

	uint128 public priceToSellInWei;

	//It is used so priceToSellInWei can be uint 
	bool public isAvailableToSell;

	event NewOwnerEvent(address old, address current);
	event WithdrawTokensEvent(address tokenAddr, address owner, uint256 value, bool sucess);
	event AvaliableToSellEvent(address owner, address contractAddr);
	event KillEvent();

	function TradeableContract (address ownerAddr) public {
		owner = ownerAddr;
		NewOwnerEvent(0x0,owner);
	}

	modifier onlyOwner {
		require(msg.sender == owner); 	
		_;
	}		


	function kill() public onlyOwner {
		KillEvent();	
		selfdestruct(owner);
	}
	
	function getOwner() public view returns (address) {
		return owner;
	}

	function getPriceToSellInWei() public view returns (int256) {		
		if (isAvailableToSell) {
			return priceToSellInWei;
		}  
		return -1;
	}

	/*
	 *	Transfer tokens to the owner
	 *	It is necessary to call the transferfunction of the original ERC20 contract code 
	 */
 	function withdrawTokens (address tokenAddr, uint256 value) public onlyOwner returns (bool) {

		bool b = IERC20Token(tokenAddr).transfer(owner,value);

		WithdrawTokensEvent(tokenAddr, owner, value, b);

		return b;

 	}


	/**
	* @dev Transfer all Ether held by the contract to the owner. It is necessary  to avoid lock funds the were send to the contract
	*/
	function reclaimEther() external onlyOwner {
		owner.transfer(address(this).balance);
	}
		

 	function setAvailableToSell (uint128 priceInWei) public onlyOwner {
		isAvailableToSell = true;
		priceToSellInWei = priceInWei;
		AvaliableToSellEvent(owner, address(this));
	}

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

