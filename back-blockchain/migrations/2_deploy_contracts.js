var TokenERC20_Mock = artifacts.require("./TokenERC20_Mock.sol");
var TradeableContract_OnlyForTests = artifacts.require("./TradeableContract.sol");

var ContractCreator = artifacts.require("./ContractCreator.sol");
var LibraryDemo = artifacts.require("./LibraryDemo.sol");
var SafeMath = artifacts.require("./SafeMath.sol");


module.exports = function(deployer) {

  deployer.deploy(TokenERC20_Mock, 100, "name", "sy");
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, LibraryDemo);
  deployer.deploy(TradeableContract_OnlyForTests, "0x627306090abab3a6e1400e9345bc60c78a8bef57");
 
 
  deployer.deploy(ContractCreator);

};
