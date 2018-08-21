pragma solidity ^0.4.18;

import "./TradeableContract.sol";


contract ContractCreator {

	bool public stopped = false;
	address public owner;
	
	address[] public contracts;
 //   mapping (address) hashToContract;
 	event NewTradeableWallet(address addr);


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
	function createTradeableContract() public stopInEmergency returns(address subcontractAddr) {
		TradeableContract tc = new TradeableContract(msg.sender); 
		contracts.push(tc);
		NewTradeableWallet(address(tc));
		return tc;		
	}

	function setCircuitBreaker (bool b) public onlyOwner {
		stopped = b;
	} 	


	// useful to know the row count in contracts index
	function getContractCount() public view returns(uint contractCount) {
		return contracts.length;
	}

	function getContracts() public view returns (address[]) {
		return contracts;
	}

	function getOwner() public view returns (address) {
		return owner;
	}

}