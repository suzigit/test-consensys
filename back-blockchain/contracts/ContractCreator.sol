pragma solidity ^0.4.18;

import "./TradeableContract.sol";


contract ContractCreator {

	bool public stopped = false;
	address public owner;
	
	address[] public contracts;


	modifier onlyOwner { 
		require(msg.sender == owner); 	
		_; 	
	}		
	
	modifier stopInEmergency { 
		require(!stopped); 
		_; 
	}

	function ContractCreator () public {
		owner = msg.sender;
	}

  // deploy a new contract
	function createTradeableContract () public stopInEmergency returns(address subcontractAddr)  {
		TradeableContract tc = new TradeableContract(msg.sender); 
		contracts.push(tc);
		return tc;		
	}

	function setCircuitBreaker (bool b) public onlyOwner {
		stopped = b;
	} 	


	// useful to know the row count in contracts index
	function getContractCount() public constant returns(uint contractCount) {
		return contracts.length;
	}



}