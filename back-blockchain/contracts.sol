pragma solidity ^0.4.13;

contract TradeableContract {
    
	address public tokensAddr;
	address public owner;
	address public contractCreatorAddr;

	uint public priceToSell;
	bool  public isAvailableToSell;

	event NewOwnerWithoutTradeEvent(address indexed old, address indexed current);
	event NewOwnerWithTradeEvent(address indexed old, address indexed current, uint price);
	event WithdrawTokensEvent(address indexed owner, uint256 valueToWithdraw);
	event WithdrawETHEvent(address indexed owner);
	event AvaliableToSellEvent(address indexed owner, address indexed contractAddr);
	
	constructor (address taddr, address oaddr, address ccaddr) public {
		tokensAddr = taddr;
		owner = oaddr;
		contractCreatorAddr = ccaddr;
	}

	modifier onlyOwner { require(msg.sender == owner); 	_; 	}		


	function kill() public onlyOwner {
		selfdestruct(owner);
	}
	
	/*
	 *	Transfer tokens to the owner
	 *	It is necessary to call the transfer function of the original ERC20 contract code 
	 */
 	function withdrawTokens (uint256 valueToWithdraw) public onlyOwner {

	    if(!tokensAddr.call(bytes4(keccak256("transfer(address, uint256)")), owner, valueToWithdraw)) revert();
		
		emit WithdrawTokensEvent(owner, valueToWithdraw);
		
 	}

	/*
	 *	Transfer ETH to the owner
	 *	It is necessary  to avoid lock funds the were send to the contract 
	 */
 	function withdrawETH () public onlyOwner {
 	    
        owner.transfer(address(this).balance); 
		
		emit WithdrawETHEvent(owner);		
 	}

 	function setAvailableToSell (uint price) public onlyOwner {
		isAvailableToSell = true;
		priceToSell = price;
		emit AvaliableToSellEvent(owner, address(this));
	}
	// e unavailableToSell?

 	function changeOwnershipWithTrade () public payable {

 	    require (isAvailableToSell==true);
 	    require (msg.value >= priceToSell);     
        
        // fee is charged
        //TODO: alterar fee address
        address feeAddress = 0x0;
        uint valueToFee = priceToSell/20;
        feeAddress.transfer(valueToFee);

        uint valueToOwner = priceToSell-valueToFee; 
        owner.transfer(valueToOwner);
		
		
    	emit NewOwnerWithTradeEvent(owner, msg.sender, priceToSell); 
        
        //Transfer the contract ownership 
        owner = msg.sender;
 	    
        isAvailableToSell = false;
 	}
 	
    function changeOwnershipWithoutTrade(address _new) public onlyOwner {    		
    	
		owner = _new; 
    	emit NewOwnerWithoutTradeEvent(owner, _new); 
		isAvailableToSell = false;
    }
	
} 

contract ContractCreator {

	bool public stopped = false;
	address public owner;
	
	modifier onlyOwner { require(msg.sender == owner); 	_; 	}		
	
	modifier stopInEmergency { require(!stopped); _; }

	constructor () public {
		owner = msg.sender;
	}


	function createTradeableContract (address tokensAddr) public stopInEmergency returns(address subcontractAddr)  {
		return new TradeableContract(tokensAddr, msg.sender, address(this)); 
	}

	function setCircuitBreaker (bool b) public onlyOwner {
		stopped = b;
	} 	

	function kill() public onlyOwner {
		selfdestruct(owner);
	}
	
}