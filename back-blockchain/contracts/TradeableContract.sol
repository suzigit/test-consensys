pragma solidity ^0.4.14;

contract TradeableContract {
    
	address public owner;
	address public contractCreatorAddr;

	uint public priceToSell;
	bool  public isAvailableToSell;

	event NewOwnerWithoutTradeEvent(address  old, address current);
	event NewOwnerWithTradeEvent(address old, address current, uint price);
	event WithdrawTokensEvent(address owner, uint256 valueToWithdraw);
	event WithdrawETHEvent(address owner);
	event AvaliableToSellEvent(address owner, address contractAddr);
	

	function TradeableContract ( address oaddr, address ccaddr) public {
		owner = oaddr;
		contractCreatorAddr = ccaddr;
	}

	modifier onlyOwner {
		require(msg.sender == owner); 	_;
	}		


	function kill() public onlyOwner {
		selfdestruct(owner);
	}
	
	/*
	 *	Transfer tokens to the owner
	 *	It is necessary to call the transfer function of the original ERC20 contract code 
	 */
 	function withdrawTokens (address tokensAddr, uint256 valueToWithdraw) public onlyOwner {

	    if (!tokensAddr.call(bytes4(keccak256("transfer(address, uint256)")), owner, valueToWithdraw)) revert();
		
		WithdrawTokensEvent(owner, valueToWithdraw);
		
 	}

	/*
	 *	Transfer ETH to the owner
	 *	It is necessary  to avoid lock funds the were send to the contract 
	 */
 	function withdrawETH () public onlyOwner {
 	    
        owner.transfer(address(this).balance); 
		
		WithdrawETHEvent(owner);		
 	}

 	function setAvailableToSell (uint price) public onlyOwner {
		isAvailableToSell = true;
		priceToSell = price;
		AvaliableToSellEvent(owner, address(this));
	}

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
		
		
    	NewOwnerWithTradeEvent(owner, msg.sender, priceToSell); 
        
        //Transfer the contract ownership 
        owner = msg.sender;
 	    
        isAvailableToSell = false;
 	}
 	
    function changeOwnershipWithoutTrade(address _new) public onlyOwner {    		
    	
		owner = _new; 
    	NewOwnerWithoutTradeEvent(owner, _new); 
		isAvailableToSell = false;
    }
	
} 

