pragma solidity 0.4.24;

/// @title A simple receiver for the buda ethereum hot wallet.
/// @notice This is just a proxy that delegates execution to BudaWalletReceiverImpl
/// @author Ignacio Baixas (ignacio0buda.com)
contract BudaWalletReceiver {
  function () payable external {
    address impl = 0x0123456789012345678901234567890123456789; // marker to resolve later

    assembly {
      // The following code is based on the ZeppelinOS Proxy implementation

      // Copy msg.data. We take full control of memory in this inline assembly
      // block because it will not return to Solidity code. We overwrite the
      // Solidity scratch pad at memory position 0.
      calldatacopy(0, 0, calldatasize)

      // Call the implementation.
      // out and outsize are 0 because we don't know the size yet.
      let result := delegatecall(gas, impl, 0, calldatasize, 0, 0)

      // Copy the returned data.
      returndatacopy(0, 0, returndatasize)

      switch result
      // delegatecall returns 0 on error.
      case 0 { revert(0, returndatasize) }
      default { return(0, returndatasize) }
    }
  }
}
