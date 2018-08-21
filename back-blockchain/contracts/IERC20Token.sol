pragma solidity ^0.4.18;


/**
 * @title IERC20Token
 * @dev IERC20 parcial interface, to be used to invoke transfer function.
 */
interface IERC20Token {

  /**
   * @dev Reproduces the signature of a transfer function from a ERC-20 token.
   * The token is transfer from the msg.sender.
   * 
   * @param _to The address of the recipient
   * @param _value the amount to send
   */
    function transfer(address to, uint256 amount) external returns (bool);

}