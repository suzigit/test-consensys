pragma solidity ^0.4.18;

contract FeeContract {

	address public owner;
	address public feeAddress;

	modifier onlyOwner { 
		require(msg.sender == owner); 	
		_; 	
	}		
	
	function FeeContract (address feeAddr) public {
		owner = msg.sender;
		feeAddress = feeAddr;
	}

	function setFeeAddress (address newFeeAddr) onlyOwner public {
		feeAddress = newFeeAddr;
	}

	function getFeeAddress () public view returns (address) {
		return feeAddress;
	}

	//TODO: receber percentual de fee, generalizar o calculo e usar lib de safemath
	function calculateFee(uint priceToSell) public pure returns (uint comissionAmount) {
		return priceToSell/20;
	}

}