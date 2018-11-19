pragma solidity ^0.4.24;

// This contract is only used for testing purposes.
contract TestToken {
  event Transfer(address indexed from, address indexed to, uint tokens);

  function transfer(address to, uint256 value) external returns (bool) {
    emit Transfer(msg.sender, to, value);
    return true;
  }
}
