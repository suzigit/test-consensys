pragma solidity ^0.4.18;

import "./FeeContract.sol";
import "./IERC20Token.sol";

contract TradeableContract {
    
	address public owner;

	uint128 public priceToSellInWei;
	bool public isAvailableToSell;
	bool public hasAlreadyChangedOwnerInItsLifetime; 

	event NewOwnerEvent(address old, address current);
	event WithdrawTokensEvent(address tokensAddr, address owner, uint256 valueToWithdraw, bool sucess);
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
	
	function hasAlreadyChangedOwnerInItsLifetime() public view returns (bool) {
		return hasAlreadyChangedOwnerInItsLifetime;
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
	 *	It is necessary to call the transfer function of the original ERC20 contract code 
	 */
 	function withdrawTokens (address tokensAddr, uint256 valueToWithdraw) public onlyOwner returns (bool) {

		bool b = IERC20Token(tokensAddr).transfer(owner,valueToWithdraw);

		WithdrawTokensEvent(tokensAddr, owner, valueToWithdraw, b);

		return b;

 	}

	/*
	 *	Transfer ETH to the owner
	 *	It is necessary  to avoid lock funds the were send to the contract 
	 */
 	function withdrawETH () public onlyOwner {
 	    
        owner.transfer((address(this)).balance); 
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
		hasAlreadyChangedOwnerInItsLifetime = true;
        address feeAddress = 0x627306090abaB3A6e1400e9345bC60c78a8BEf57;
        

        uint128 feeValueInWei = priceToSellInWei/20; 
        uint128 valueToOwnerInWei = priceToSellInWei-feeValueInWei;

		priceToSellInWei = 0; //Avoid reentrancy attack

		//INTERACTION
        feeAddress.transfer(feeValueInWei);
        oldOwner.transfer(valueToOwnerInWei);

 	}
 	
	
} 

