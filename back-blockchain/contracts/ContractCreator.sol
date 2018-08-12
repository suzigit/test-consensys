pragma solidity ^0.4.14;

import "./TradeableContract.sol";


contract ContractCreator {

	bool public stopped = false;
	address public owner;
	
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

	function createTradeableContract () public stopInEmergency returns(address subcontractAddr)  {
		return new TradeableContract(msg.sender, address(this)); 
	}

	function setCircuitBreaker (bool b) public onlyOwner {
		stopped = b;
	} 	

	function kill() public onlyOwner {
		selfdestruct(owner);
	}
	
}