/* eslint-disable no-undef */
const Staking = artifacts.require("./Staking.sol");
const Token1 = artifacts.require("./Token1.sol");
const Token2 = artifacts.require("./Token2.sol");

// eslint-disable-next-line func-names
module.exports = function (deployer) {
  deployer.deploy(Staking);
  deployer.deploy(Token1);
  deployer.deploy(Token2);
};
