pragma solidity 0.4.24;

interface IERC20 {
  event Transfer(address indexed from, address indexed to, uint tokens);

  function transfer(address to, uint256 value) external returns (bool);
}

/// @title A simple receiver for the buda ethereum hot wallet
/// @author Ignacio Baixas (ignacio0buda.com)
contract BudaWalletReceiverImpl {

  // /// EVENTS

  event Received(address indexed wallet, uint amount);

  // /// ATTRIBUTES

  address constant wallet = 0x0123456789012345678901234567890123456789; // marker to resolve later

  // /// METHODS

  /// @notice Transfers a given amount of ETH or token to the wallet address
  /// @param amount_ Amount to transfer
  /// @param token_ The address of the token contract to use (or 0x0 to send ETH)
  function flush(uint amount_, address token_) external {
    if (token_ != 0x0) {
      IERC20 token = IERC20(token_);
      require(token.transfer(wallet, amount_));
    } else {
      wallet.transfer(amount_);
    }
  }

  function () payable external {
    emit Received(wallet, msg.value);
  }
}
