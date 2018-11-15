const _ = require('lodash');

const { wait, replaceBinaryMarker } = require('./support/helpers');

var TestToken = artifacts.require("./TestToken.sol")

contract('BudaWalletReceiver', function(accounts) {
  const user = accounts[0];
  const wallet = accounts[1];

  let implementation = null;
  let instance = null;

  before(wait(async () => {
    var BudaWalletReceiverImpl = artifacts.require("./BudaWalletReceiverImpl.sol")
    var BudaWalletReceiver = artifacts.require("./BudaWalletReceiver.sol")

    replaceBinaryMarker(BudaWalletReceiverImpl, wallet);
    implementation = await BudaWalletReceiverImpl.new({ from: user });

    replaceBinaryMarker(BudaWalletReceiver, implementation.address)
    let preInstance = await BudaWalletReceiver.new({ from: user });
    instance = BudaWalletReceiverImpl.at(preInstance.address); // cast instance to implementation
  }));

  describe("Received", () => {
    it("gets triggered when receiver instance receives some eth", wait(async () => {
      let watcher = instance.Received();
      let tx = await instance.sendTransaction({ from: user, value: 100, gas: 100000 });
      let events = await watcher.get();

      assert.equal(events.length, 1);
      assert.equal(events[0].address, instance.address);
      assert.equal(events[0].args.wallet, wallet);

      console.log(`Gas used: ${tx.receipt.gasUsed}`)
      assert.isBelow(tx.receipt.gasUsed, 30000);
    }));
  });

  describe("flush", () => {
    context("when receiver has some ETH", () => {
      beforeEach(wait(async () => {
        await instance.sendTransaction({ from: user, value: 100000000000000000, gas: 100000 });
      }));

      it("sends ETH to configured wallet address", wait(async () => {
        let balance = web3.eth.getBalance(wallet).toNumber();
        let tx = await instance.flush(50000000000000000, 0, { from: user, gas: 100000 });
        let newBalance = web3.eth.getBalance(wallet).toNumber();

        assert.equal(newBalance - balance, 50000000000000000);

        console.log(`Gas used: ${tx.receipt.gasUsed}`)
        assert.isBelow(tx.receipt.gasUsed, 35000);
      }));
    });

    context("when there is a token contract", () => {
      let token;

      beforeEach(wait(async () => {
        token = await TestToken.new({ from: user });
      }));

      it("calls the token contract transfer method to send tokens to wallet", wait(async () => {
        let watcher = token.Transfer();
        let tx = await instance.flush(10, token.address, { from: user, gas: 100000 });

        let events = await watcher.get();
        assert.equal(events.length, 1);
        assert.equal(events[0].args.from, instance.address);
        assert.equal(events[0].args.to, wallet);
        assert.equal(events[0].args.value.toNumber(), 10);

        console.log(`Gas used: ${tx.receipt.gasUsed}`);
        assert.isBelow(tx.receipt.gasUsed, 30000);
      }));
    });
  });
});
