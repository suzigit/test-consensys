pragma solidity ^0.4.18;

import "./TradeableContract.sol";

/**
 * @title ContractCreator.
 * @dev Creator of Tradeable Wallet contracts. It is also a repository of Tradeable Wallet addresses.
 */
contract ContractCreator {

	bool public stopped = false;
	address public owner;	
	address[] public contracts;
 
 
 	event NewTradeableWallet(address addr);

	modifier onlyOwner { 
		require(msg.sender == owner); 	
		_; 	
	}		
	
	modifier stopInEmergency { 
		require(!stopped); 
		_; 
	}

  /**
   * @dev Create a new contract. 
   * The owner is going to be msg.sender.   
   */
	function ContractCreator () public {
		owner = msg.sender;
	}

  /**
   * @dev create a new Tradeable Contract, stores its reference and emit an event with the same info 
   * @return - the address of the create contract.
   */
	function createTradeableContract() public stopInEmergency returns(address subcontractAddr) {
		TradeableContract tc = new TradeableContract(msg.sender); 
		contracts.push(tc);
		NewTradeableWallet(address(tc));
		return tc;		
	}

  /**
   * @dev Useful to enable a pause in the creation of new Tradeable Contracts. 
   * It can only be called by the owner.
   * @param b - if true, it is not possible to create new Tradeable Contracts.
   */
	function setCircuitBreaker (bool b) public onlyOwner {
		stopped = b;
	} 	

  /**
   * @dev Returns the number of Tradeable Contract created. 
   * This number does not consider if the Tradeable Contract is alive (it could be killed by its owner)
   */
	function getContractCount() public view returns(uint contractCount) {
		return contracts.length;
	}

  /**
   * @dev Returns the address all Tradeable Contract created. 
   * This set does not consider if the Tradeable Contract is alive (it could be killed by its owner)
   */
	function getContracts() public view returns (address[]) {
		return contracts;
	}

  /**
   * @dev Returns the owner of this contract.
   */
	function getOwner() public view returns (address) {
		return owner;
	}

}