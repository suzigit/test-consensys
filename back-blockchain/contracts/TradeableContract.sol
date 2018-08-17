pragma solidity ^0.4.18;

import "./FeeContract.sol";
import "./IERC20Token.sol";

contract TradeableContract {
    
	address public owner;

	uint128 public priceToSellInWei;
	bool public isAvailableToSell;
	bool public hasAlreadyChangedOwnerInItsLifetime; 

	event NewContract(address owner);
	event NewOwnerWithoutTradeEvent(address  old, address current);
	event NewOwnerWithTradeEvent(address old, address current);
	event WithdrawTokensEvent(address contractoOwner, uint256 valueToWithdraw);
	event WithdrawError();
	event AvaliableToSellEvent(address contractoOwner, address contractAddr);
	event Kill();

	function TradeableContract (address ownerAddr) public {
		owner = ownerAddr;
		NewContract(owner);
	}

	modifier onlyOwner {
		require(msg.sender == owner); 	
		_;
	}		


	function kill() public onlyOwner {
		Kill();	
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

		if (b) {
			WithdrawTokensEvent(owner, valueToWithdraw);
		} else {
			WithdrawError();
		}
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

    	NewOwnerWithTradeEvent(oldOwner, msg.sender); 	
        
        owner = msg.sender;

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
