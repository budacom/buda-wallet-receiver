# buda-wallet-receiver

This contract is a key part of the buda-ethereum-wallet.

This contract is used to receive incomming funds. Every address provided by the wallet points to an instance of this contract.

## Mechanism

Every time the `BudaWalletReceiver` contract receives funds it triggers a `Received` event. It does not trigger events when tokens are received, token events can be monitored on the token contract.

There is a `flush(amount, token_address = 0x0)` method that can be used to send funds or tokens to a 'master' wallet. The 'master' wallet address is hardcoded into the contract.

To make the `BudaWalletReceiver` as cheap to deploy as posible, a single `BudaWalletReceiverImpl` is deployed and then every instance of `BudaWalletReceiver` is just a proxy to the implementation. The implementation address is hardcoded into the contract. The proxy implementation is based on ZeppelinOS Proxy contract.

## Caveats

Both `BudaWalletReceiverImpl` and `BudaWalletReceiver` use hardcoded addresses that need to be set at deployment. The **marker** address `0x0123456789012345678901234567890123456789` has been put in place so it can be replaced by the corresponding address. Replacement can be performed over the ABI `bytecode` before deployment.

## Testing

To run the tests:

* Make sure `ganache-cli` is running using `ganache-cli -p 8545`.
* `npm install`
* `npm run test `
