/* eslint-disable no-undef */
const BigNumber = require("bignumber.js");
const wait = require("./wait.js");
const Staking = artifacts.require("./Staking.sol");
const Token1 = artifacts.require("./Token1.sol");
const Token2 = artifacts.require("./Token2.sol");

contract("Staking", (accounts) => {
  let staking;
  let token1;
  let token2;
  const [owner, account1, account2, account3] = accounts;

  const ownerAddress = tronWeb.address.toHex(owner);
  const account1Address = tronWeb.address.toHex(account1);
  const account2Address = tronWeb.address.toHex(account2);
  const account3Address = tronWeb.address.toHex(account3);

  before(async () => {
    if (accounts.length < 4) {
      // Set your own accounts if you are not using Tron Quickstart
    }
    staking = await Staking.deployed();
    token1 = await Token1.deployed();
    token2 = await Token2.deployed();

    await wait(2);
  });

  it("Should verify fee collector is the deployer", async () => {
    const feeCollector = await staking.feeCollector();
    assert.equal(feeCollector, ownerAddress, "Incorrect address");
  });

  it("Should change Fee Collector", async () => {
    await staking.setCollector(account1Address, { from: owner });

    const feeCollector = await staking.feeCollector();
    assert.equal(feeCollector, account1Address, "Fee Collector Doesn't match");
  });

  it.only("Stake 90 Token1 tokens", async () => {
    const amount1 = 90;
    const fee1 = (amount1 * 1) / 100;
    const amount2 = 80;
    const fee2 = (amount2 * 1) / 100;
    const decimals = await token1.decimals();

    const stakeAmount1 = BigNumber(10).pow(decimals).multipliedBy(amount1).toFixed();
    const feeAmount1 = BigNumber(10).pow(decimals).multipliedBy(fee1).toFixed();

    const stakeAmount2 = BigNumber(10).pow(decimals).multipliedBy(amount2).toFixed();
    const feeAmount2 = BigNumber(10).pow(decimals).multipliedBy(fee2).toFixed();

    await staking.setCollector(account1Address, { from: owner });
    await token1.approve(
      staking.address,
      BigNumber(10)
        .pow(decimals)
        .multipliedBy(amount1 + fee1)
        .toFixed(),
      {
        from: owner,
      }
    );
    await token2.approve(
      staking.address,
      BigNumber(10)
        .pow(decimals)
        .multipliedBy(amount2 + fee2)
        .toFixed(),
      {
        from: owner,
      }
    );
    await staking.stake(token1.address, stakeAmount1, {
      from: owner,
    });
    await staking.stake(token2.address, stakeAmount2, {
      from: owner,
    });

    await wait(2);

    const accountData = await staking.getBalances(ownerAddress, [token1.address, token2.address]);
    const feeCollector1Balance = await token1.balanceOf(account1Address);
    const feeCollector2Balance = await token2.balanceOf(account1Address);
    assert.equal(accountData[0].toString(), stakeAmount1, "User doesn't have 90 tokens");
    assert.equal(accountData[1].toString(), stakeAmount2, "User doesn't have 90 tokens");
    assert.equal(
      feeCollector1Balance.toString(),
      feeAmount1,
      `Fee Collector doesn't have 9 tokens`
    );
    assert.equal(
      feeCollector2Balance.toString(),
      feeAmount2,
      `Fee Collector doesn't have 8 tokens`
    );
  });

  it("Stake 100 Token1 tokens", async () => {
    const decimals = await token1.decimals();
    const stakeAmount = BigNumber(10).pow(decimals).multipliedBy(100).toFixed();
    const feeAmount = BigNumber(10).pow(decimals).multipliedBy(2).toFixed();

    await staking.setCollector(account2Address, { from: owner });
    await token1.approve(
      staking.address,
      BigNumber(10).pow(decimals).multipliedBy(102).toString(),
      {
        from: owner,
      }
    );
    await staking.stake(token1.address, stakeAmount, {
      from: owner,
    });

    await wait(2);

    const accountData = await staking.getBalances(ownerAddress, [token1.address]);

    const feeCollectorBalance = await token1.balanceOf(account2Address);
    assert.equal(
      accountData[0].toString(),
      BigNumber(10).pow(decimals).multipliedBy(190).toFixed(),
      "User doesn't have 100 tokens"
    );
    assert.equal(feeCollectorBalance.toString(), feeAmount, "Fee Collector doesn't have 2 tokens");
  });

  it("Stake 2000 Token1 tokens", async () => {
    const decimals = await token1.decimals();
    const stakeAmount = BigNumber(10).pow(decimals).multipliedBy(2000).toFixed();
    const feeAmount = BigNumber(10).pow(decimals).multipliedBy(60).toFixed();

    await staking.setCollector(account3Address, { from: owner });

    await token1.approve(
      staking.address,
      BigNumber(10).pow(decimals).multipliedBy(2060).toFixed(),
      {
        from: owner,
      }
    );

    await staking.stake(token1.address, stakeAmount, {
      from: owner,
    });

    await wait(2);

    const accountData = await staking.getBalances(ownerAddress, [token1.address]);

    const feeCollectorBalance = await token1.balanceOf(account3Address);
    assert.equal(
      accountData[0].toString(),
      BigNumber(10).pow(decimals).multipliedBy(2190).toFixed(),
      "User doesn't have 2000 tokens"
    );
    assert.equal(feeCollectorBalance.toString(), feeAmount, "Fee Collector doesn't have 60 tokens");
  });
});
