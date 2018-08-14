pragma solidity ^0.4.18;

import "./FeeContract.sol";

contract TradeableContract {
    
	address public owner;

	uint public priceToSell;
	bool public isAvailableToSell;
	bool public hasAlreadyChangedOwnerInItsLifetime; 

	event NewOwnerWithoutTradeEvent(address  old, address current);
	event NewOwnerWithTradeEvent(address old, address current, uint price);
	event WithdrawTokensEvent(address contractoOwner, uint256 valueToWithdraw);
//	event WithdrawETHEvent(address contractoOwner);
	event AvaliableToSellEvent(address contractoOwner, address contractAddr);


incluir endereco do contrato no evento?
evento de  criacao para pagina de seus contratos?
pagina de contratos a venda
pagina de evntos do contrato
evento de kill,interface p kill?
link ipfs de saft?


	function TradeableContract (address ownerAddr) public {
		owner = ownerAddr;
	}

	modifier onlyOwner {
		require(msg.sender == owner); 	
		_;
	}		


	function kill() public onlyOwner {
		selfdestruct(owner);
	}
	
	function hasAlreadyChangedOwnerInItsLifetime() public view returns (bool) {
		return hasAlreadyChangedOwnerInItsLifetime;
	}

	function getOwner() public view returns (address) {
		return owner;
	}

	/*
	 *	Transfer tokens to the owner
	 *	It is necessary to call the transfer function of the original ERC20 contract code 
	 */
 	function withdrawTokens (address tokensAddr, uint256 valueToWithdraw) public onlyOwner {

	    if (!tokensAddr.call(bytes4(keccak256("transfer(address, uint256)")), owner, valueToWithdraw)) 
			revert();
		
		WithdrawTokensEvent(owner, valueToWithdraw);
		
 	}

	/*
	 *	Transfer ETH to the owner
	 *	It is necessary  to avoid lock funds the were send to the contract 
	 */
 	function withdrawETH () public onlyOwner {
 	    
        owner.transfer((address(this)).balance); 
		
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
        uint feeValue = priceToSell/20;
        feeAddress.transfer(feeValue);

        uint valueToOwner = priceToSell-feeValue; 
        owner.transfer(valueToOwner);
		
		
    	NewOwnerWithTradeEvent(owner, msg.sender, priceToSell); 
        
        //Transfer the contract ownership 
        owner = msg.sender;
 	    
        isAvailableToSell = false;
		hasAlreadyChangedOwnerInItsLifetime = true;
 	}
 	
    function changeOwnershipWithoutTrade(address _new) public onlyOwner {    		
    	
		owner = _new; 
    	NewOwnerWithoutTradeEvent(owner, _new); 
		isAvailableToSell = false;
		hasAlreadyChangedOwnerInItsLifetime = true;

    }
	
} 

