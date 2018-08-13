pragma solidity ^0.4.18;

library ConversionLib {

	function convert(uint amount,uint conversionRate) public pure returns (uint convertedAmount)  {
		return amount * conversionRate;
	}

	
}
