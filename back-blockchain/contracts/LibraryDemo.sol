pragma solidity ^0.4.18;

import "./SafeMath.sol";

/**
 * @title LibraryDemo
 * @dev Demo to show how to use libraries.
 */
contract LibraryDemo {

	mapping (uint => uint) booksToPrices;

	function LibraryDemo() public {

	}

  /**
   * @dev include a new book in a set.
   * @param bookCode - index of the book in the set of books. 
   * @param price - price of the book
   */
	function includeBook(uint bookCode, uint price) public  {
		booksToPrices[bookCode] = price;
	}

  /**
   * @dev ilustrate the use of the library SafeMath.  
   * DO NOT REUSE THIS CODE: It function is vulnerable to DoS with Block Gas Limit. It is for illustrative purporses only.
   * @param maxCode - value of max index (=code) whose price is going to be summed.
   * @return -  the function is going to return the price sum of books from index 0 until index maxCode.
   */
	function getTotalPriceUntilACode(uint maxCode) public view returns(uint) {

        uint total = 0;
        for (uint i=0; i<maxCode; i++) {
            total = SafeMath.add(total, booksToPrices[i]);
        }
        return total;
	}

}