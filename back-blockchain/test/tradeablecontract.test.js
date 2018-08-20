require('babel-polyfill');
var TradeableContract  = artifacts.require("./TradeableContract.sol");
var TokenERC20_Mock = artifacts.require("./TokenERC20_Mock.sol");


var contractInstance;

contract('TradeableContract', function(accounts) {

  const initialOwner = "0x627306090abab3a6e1400e9345bc60c78a8bef57";
  const alice = accounts[1];
  const bob = accounts[2];


  it("should create the contract with the correct owner", function () {
    return TradeableContract.deployed()
        .then(function (instance) {
            return instance.getOwner.call();
        }).then(function (owner) {
            assert.equal(owner, initialOwner, "Owner não é igual ao utilizado " + owner);      
        })
  });


  it("should perform a withdraw operation using owner", function () {
    return TradeableContract.deployed()
        .then(function (TCinstance) {
            return TokenERC20_Mock.deployed().then(function(tokenInstance) {
                    return TCinstance.withdrawTokens(tokenInstance.address, 0, {from: initialOwner});
            })             
        })
        .then(function (result) {
            let eventName = result.logs[0].event;
            let args = result.logs[0].args;
            assert.equal(eventName, "WithdrawTokensEvent", 'WithdrawTokensEvent event should fire.');
            assert.equal(args.sucess, true, 'WithdrawTokensEvent should indicate sucess.');
        })
  });


  it("should not perform a withdraw operation if not using owner", function () {
    return TradeableContract.deployed()
        .then(function (TCinstance) {
            return TokenERC20_Mock.deployed().then(function(tokenInstance) {
                    return TCinstance.withdrawTokens(tokenInstance.address, 0, {from: alice})
                            .then(function(r) {
                                assert(false, 'should not performed withdraw!!!');
                                return true;
                            },
                            function(e) {
                                assert.match(e, /VM Exception[a-zA-Z0-9 ]+: invalid opcode/, "withdraw (1) not using owner should have raised VM exception");
                            });
                    })             
        })
  });


  it("should put wallet for sale using owner", function () {
    let price = 20;
    return TradeableContract.deployed()
        .then(function (TCinstance) {
            return TCinstance.setAvailableToSell(price, {from: initialOwner})
            .then(function() {
                return TCinstance.getPriceToSellInWei.call();
            })
        })
        .then(function (result) {
                assert.equal(result, price, 'Wallet price should be .' + price);
         });
  });





});