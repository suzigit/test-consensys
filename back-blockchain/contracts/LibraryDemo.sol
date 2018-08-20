pragma solidity ^0.4.18;

import "./SafeMath.sol";

contract LibraryDemo {
	mapping (uint => uint) booksToPrices;

	function LibraryDemo() public {

	}

	function includeBook(uint bookCode, uint price) public  {
		booksToPrices[bookCode] = price;
	}

	function getTotalPriceUntilACode(uint maxCode) public view returns(uint) {

        uint total = 0;
        for (uint i=0; i<maxCode; i++) {
            total = SafeMath.add(total, booksToPrices[i]);
        }
        return total;
	}

}