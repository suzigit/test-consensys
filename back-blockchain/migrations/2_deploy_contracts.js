var TokenERC20_Test = artifacts.require("./TokenERC20_Test.sol");
var ConvertLib = artifacts.require("./ConversionLib.sol");
var TestCoin = artifacts.require("./TestCoin.sol");
var FeeContract = artifacts.require("./FeeContract.sol");
var TradeableContract = artifacts.require("./TradeableContract.sol");
var ContractCreator = artifacts.require("./ContractCreator.sol");


module.exports = function(deployer) {
  deployer.deploy(TokenERC20_Test, 100, "name", "sy");
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, TestCoin);
  deployer.deploy(TestCoin);
  deployer.deploy(FeeContract);
//  deployer.deploy(TradeableContract);
  deployer.deploy(ContractCreator);

};
