/* eslint-disable jest/valid-describe */
/* eslint-disable no-undef */
const { assert, expect } = require("chai");
const deploymentHelperLiquity = require("../utils/deploymentHelperLiquity");
const deploymentHelperHarp = require("../utils/deploymentHelperHarp");
const { ethers, artifacts } = require("hardhat");
const testHelpers = require("../utils/testHelpers.js");
require("chai").use(require("chai-as-promised")).should();
const StabilityPool = artifacts.require("./StabilityPool.sol");
const StabilityProxy = artifacts.require("./StabilityProxy");
const BigNumber = require("bignumber.js");
const th = testHelpers.TestHelper;

const SECOND = 1000;
const HOUR = 60 * 60;
const DAY = 24 * HOUR;

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

const truncateString = (str) => {
  return str.substr(0, 4);
};

const makeBN = (n) => {
  return new web3.utils.BN(n);
};

const advanceBlock = async (n) => {
  await web3.currentProvider.send(
    {
      id: 0,
      jsonrpc: "2.0",
      method: "evm_setIntervalMining",
      params: [5000],
    },
    (err) => {
      if (err) console.log(err);
    }
  );
  for (let i = 0; i < n; i++) {
    await th.fastForwardTime(5000, web3.currentProvider);
  }
};

contract("STRING Token Tests", () => {
  let contracts,
    accounts,
    harpContracts,
    stringToken,
    lusdToken,
    lqtyToken,
    stabilityFactory,
    stabilityPool,
    stringStaking;

  const HarpDAO = "0xdF7054884fCb9A8681490A1D977fbD295C02cCFF";
  const AngelDAO = "0x3Af2d668Afd7eF2B94b0862aE759712c067DFa4c";

  const yearsToLockUp = 365;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    contracts = await deploymentHelperLiquity.deployLiquityCore();
    const LQTYContracts = await deploymentHelperLiquity.deployLQTYTesterContractsHardhat(
      accounts[1].address,
      accounts[2].address,
      accounts[3].address
    );
    contracts.stabilityPool = await StabilityPool.new();
    contracts = await deploymentHelperLiquity.deployLUSDToken(contracts);

    stabilityPool = contracts.stabilityPool;

    lqtyToken = LQTYContracts.lqtyToken;
    lusdToken = contracts.lusdToken;

    contracts = { ...contracts, lqtyToken };

    await deploymentHelperLiquity.connectLQTYContracts(LQTYContracts);
    await deploymentHelperLiquity.connectCoreContracts(
      contracts,
      LQTYContracts
    );
    await deploymentHelperLiquity.connectLQTYContractsToCore(
      LQTYContracts,
      contracts
    );
    harpContracts = await deploymentHelperHarp(accounts, contracts);
    stringToken = harpContracts.stringToken;
    stabilityFactory = harpContracts.stabilityFactory;
    tokenVesting = harpContracts.tokenVesting;
    stringStaking = harpContracts.stringStaking;
    farm = harpContracts.farm;
    await stringToken.addMinter(stabilityFactory.address);
    await stringToken.addMinter(accounts[0].address);
  });

  describe("Stability Factory attributes on deployment", async () => {
    // it("Sets correct frontend", async () => {
    //   const started = await stabilityFactory.frontEnd();
    //   assert.equal(started, stringStaking.address);
    // });
    // it("Sets correct stringtoken address", async () => {
    //   const started = await stabilityFactory.stringToken();
    //   assert.equal(started, stringToken.address);
    // });
    // it("Sets correct stabilityPool address", async () => {
    //   const started = await stabilityFactory.stabilityPool();
    //   assert.equal(started, stabilityPool.address);
    // });
    // it("Sets correct lqtyToken address", async () => {
    //   const started = await stabilityFactory.lqtyToken();
    //   assert.equal(started, lqtyToken.address);
    // });
    // it("Sets correct lusdToken address", async () => {
    //   const started = await stabilityFactory.lusdToken();
    //   assert.equal(started, lusdToken.address);
    // });
    // it("Sets correct rewardperblock", async () => {
    //   const reward = await stabilityFactory.stringPerBlock();
    //   assert.equal(reward.toString(), tokens("0.9230769231"));
    // });
  });

  describe("Farm actions", async () => {
    // it("deploy proxies", async () => {
    //   const owner = accounts[0];
    //   const owner2 = accounts[1];
    //   const owner3 = accounts[2];
    //   await stabilityFactory.connect(owner).createStabilityProxy();
    //   await stabilityFactory.connect(owner2).createStabilityProxy();
    //   await stabilityFactory.connect(owner3).createStabilityProxy();
    //   const ownerProxyAddr = await stabilityFactory.userProxys(owner.address);
    //   const owner2ProxyAddr = await stabilityFactory.userProxys(owner2.address);
    //   const owner3ProxyAddr = await stabilityFactory.userProxys(owner3.address);
    //   //   console.log(ownerProxyAddr.proxyAddress);
    //   const ownerProxy = await StabilityProxy.at(ownerProxyAddr.proxyAddress);
    //   const owner2Proxy = await StabilityProxy.at(owner2ProxyAddr.proxyAddress);
    //   const owner3Proxy = await StabilityProxy.at(owner3ProxyAddr.proxyAddress);
    //   const addr = await ownerProxy.owner();
    //   const addr2 = await owner2Proxy.owner();
    //   const addr3 = await owner3Proxy.owner();
    //   console.log(addr);
    //   console.log(addr2);
    //   console.log(addr3);
    //   console.log();
    //   assert.equal(owner.address, addr);
    //   assert.equal(owner2.address, addr2);
    //   assert.equal(owner3.address, addr3);
    // });
    // const deployProxies = async () => {
    //   const owner = accounts[0];
    //   const owner2 = accounts[1];
    //   const owner3 = accounts[2];
    //   await stabilityFactory.connect(owner).createStabilityProxy();
    //   await stabilityFactory.connect(owner2).createStabilityProxy();
    //   await stabilityFactory.connect(owner3).createStabilityProxy();
    //   const ownerProxyAddr = await stabilityFactory.userProxys(owner.address);
    //   const owner2ProxyAddr = await stabilityFactory.userProxys(owner2.address);
    //   const owner3ProxyAddr = await stabilityFactory.userProxys(owner3.address);
    //   //   console.log(ownerProxyAddr.proxyAddress);
    //   const ownerProxy = await StabilityProxy.at(ownerProxyAddr.proxyAddress);
    //   const owner2Proxy = await StabilityProxy.at(owner2ProxyAddr.proxyAddress);
    //   const owner3Proxy = await StabilityProxy.at(owner3ProxyAddr.proxyAddress);
    //   return { ownerProxy, owner2Proxy, owner3Proxy };
    // };
    // const mintLUSD = async () => {
    //   const owner = accounts[0];
    //   const owner2 = accounts[1];
    //   const owner3 = accounts[2];
    //   await lusdToken.mintTo(owner.address, tokens("1000"), {
    //     from: owner.address,
    //   });
    //   await lusdToken.mintTo(owner2.address, tokens("1000"), {
    //     from: owner2.address,
    //   });
    //   await lusdToken.mintTo(owner3.address, tokens("1000"), {
    //     from: owner3.address,
    //   });
    // };
    // it("deploy proxy then deposit", async () => {
    //   let owner = accounts[0];
    //   await mintLUSD();
    //   const { ownerProxy } = await deployProxies();
    //   await lusdToken.approve(ownerProxy.address, tokens("100"), {
    //     from: owner.address,
    //   });
    //   await ownerProxy.deposit(tokens("10"), { from: owner.address });
    //   const userBalance = (await lusdToken.balanceOf(owner.address)).toString();
    //   const proxyBalance = (
    //     await lusdToken.balanceOf(ownerProxy.address)
    //   ).toString();
    //   const proxyLUSDBalance = await ownerProxy.lusdBalance();
    //   const stabilityBalance = await lusdToken.balanceOf(stabilityPool.address);
    //   const userAccount = (await stabilityFactory.userProxys(owner.address))
    //     .amount;
    //   assert.equal(userAccount, tokens("10"));
    //   assert.equal(userBalance, tokens("990"));
    //   assert.equal(proxyBalance, tokens("0"));
    //   assert.equal(proxyLUSDBalance, tokens("10"));
    //   assert.equal(stabilityBalance, tokens("10"));
    // });
    // const withdrawCheckROI = async (proxy) => {
    //   let owner = accounts[0];
    //   await proxy.withdraw(tokens("10"), { from: owner.address });
    //   const userBalance = (await lusdToken.balanceOf(owner.address)).toString();
    //   const proxyBalance = (
    //     await lusdToken.balanceOf(proxy.address)
    //   ).toString();
    //   const stabilityBalance = (
    //     await lusdToken.balanceOf(stabilityPool.address)
    //   ).toString();
    //   const proxyLUSDBalance = await proxy.lusdBalance();
    //   const rewards = await stringToken.balanceOf(owner.address);
    //   const stringPerBlock = await stabilityFactory.stringPerBlock();
    //   const expectedRewards = stringPerBlock.mul(5).mul(11);
    //   assert.equal(rewards.toString(), expectedRewards.toString());
    //   assert.equal(userBalance, tokens("1000"));
    //   assert.equal(proxyBalance, tokens("0"));
    //   assert.equal(stabilityBalance, tokens("0"));
    //   assert.equal(proxyLUSDBalance, tokens("0"));
    // };
    // const claimCheckROI = async (proxy) => {
    //   let owner = accounts[0];
    //   await proxy.claim({ from: owner.address });
    //   const userBalance = (await lusdToken.balanceOf(owner.address)).toString();
    //   const proxyBalance = (
    //     await lusdToken.balanceOf(proxy.address)
    //   ).toString();
    //   const stabilityBalance = (
    //     await lusdToken.balanceOf(stabilityPool.address)
    //   ).toString();
    //   const proxyLUSDBalance = await proxy.lusdBalance();
    //   const rewards = await stringToken.balanceOf(owner.address);
    //   const stringPerBlock = await stabilityFactory.stringPerBlock();
    //   const expectedRewards = stringPerBlock.mul(5).mul(11);
    //   assert.equal(rewards.toString(), expectedRewards.toString());
    //   assert.equal(userBalance, tokens("990"));
    //   assert.equal(proxyBalance, tokens("0"));
    //   assert.equal(proxyLUSDBalance, tokens("10"));
    //   assert.equal(stabilityBalance, tokens("10"));
    // };
    // it("withdraw full from pool", async () => {
    //   let owner = accounts[0];
    //   await mintLUSD();
    //   const { ownerProxy } = await deployProxies();
    //   await lusdToken.approve(ownerProxy.address, tokens("100"), {
    //     from: owner.address,
    //   });
    //   await ownerProxy.deposit(tokens("10"), { from: owner.address });
    //   //    goes 1 extra
    //   await advanceBlock(10);
    //   await withdrawCheckROI(ownerProxy);
    // });
    // it("claim from pool", async () => {
    //   let owner = accounts[0];
    //   await mintLUSD();
    //   const { ownerProxy } = await deployProxies();
    //   await lusdToken.approve(ownerProxy.address, tokens("100"), {
    //     from: owner.address,
    //   });
    //   await ownerProxy.deposit(tokens("10"), { from: owner.address });
    //   //    goes 1 extra
    //   await advanceBlock(10);
    //   await claimCheckROI(ownerProxy);
    // });
    // const handleDeposit = async () => {
    //   const owner = accounts[0];
    //   const owner2 = accounts[1];
    //   await mintLUSD();
    //   const { ownerProxy, owner2Proxy } = await deployProxies();
    //   await lusdToken.approve(ownerProxy.address, tokens("100"), {
    //     from: owner.address,
    //   });
    //   await lusdToken.approve(owner2Proxy.address, tokens("100"), {
    //     from: owner2.address,
    //   });
    //   await ownerProxy.deposit(tokens("10"), { from: owner.address });
    //   await owner2Proxy.deposit(tokens("50"), { from: owner2.address });
    //   return { ownerProxy, owner2Proxy };
    // };
    // it("2 users deposit in pool 1", async () => {
    //   const owner = accounts[0];
    //   const owner2 = accounts[1];
    //   const { ownerProxy, owner2Proxy } = await handleDeposit();
    //   const userBalance = (await lusdToken.balanceOf(owner.address)).toString();
    //   const userBalance2 = (
    //     await lusdToken.balanceOf(owner2.address)
    //   ).toString();
    //   const proxyBalance = (
    //     await lusdToken.balanceOf(ownerProxy.address)
    //   ).toString();
    //   const proxyBalance2 = (
    //     await lusdToken.balanceOf(owner2Proxy.address)
    //   ).toString();
    //   const stabilityBalance = (
    //     await lusdToken.balanceOf(stabilityPool.address)
    //   ).toString();
    //   const proxyLUSDBalance = (await ownerProxy.lusdBalance()).toString();
    //   const proxy2LUSDBalance = (await owner2Proxy.lusdBalance()).toString();
    //   assert.equal(proxyLUSDBalance, tokens("10"));
    //   assert.equal(proxy2LUSDBalance, tokens("50"));
    //   assert.equal(userBalance, tokens("990"));
    //   assert.equal(userBalance2, tokens("950"));
    //   assert.equal(stabilityBalance, tokens("60"));
    //   assert.equal(proxyBalance, tokens("0"));
    //   assert.equal(proxyBalance2, tokens("0"));
    // });
    // it("2 users deposit in pool then 1 withdraws half", async () => {
    //   const owner = accounts[0];
    //   const owner2 = accounts[1];
    //   const { ownerProxy, owner2Proxy } = await handleDeposit();
    //   let userBalance = (await lusdToken.balanceOf(owner.address)).toString();
    //   let userBalance2 = (await lusdToken.balanceOf(owner2.address)).toString();
    //   let proxyBalance = (
    //     await lusdToken.balanceOf(ownerProxy.address)
    //   ).toString();
    //   let proxyBalance2 = (
    //     await lusdToken.balanceOf(owner2Proxy.address)
    //   ).toString();
    //   let stabilityBalance = (
    //     await lusdToken.balanceOf(stabilityPool.address)
    //   ).toString();
    //   let proxyLUSDBalance = (await ownerProxy.lusdBalance()).toString();
    //   let proxy2LUSDBalance = (await owner2Proxy.lusdBalance()).toString();
    //   assert.equal(proxyLUSDBalance, tokens("10"));
    //   assert.equal(proxy2LUSDBalance, tokens("50"));
    //   assert.equal(userBalance, tokens("990"));
    //   assert.equal(userBalance2, tokens("950"));
    //   assert.equal(stabilityBalance, tokens("60"));
    //   assert.equal(proxyBalance, tokens("0"));
    //   assert.equal(proxyBalance2, tokens("0"));
    //   await owner2Proxy.withdraw(tokens("25"), { from: owner2.address });
    //   userBalance = (await lusdToken.balanceOf(owner.address)).toString();
    //   userBalance2 = (await lusdToken.balanceOf(owner2.address)).toString();
    //   proxyBalance = (await lusdToken.balanceOf(ownerProxy.address)).toString();
    //   proxyBalance2 = (
    //     await lusdToken.balanceOf(owner2Proxy.address)
    //   ).toString();
    //   stabilityBalance = (
    //     await lusdToken.balanceOf(stabilityPool.address)
    //   ).toString();
    //   proxyLUSDBalance = (await ownerProxy.lusdBalance()).toString();
    //   proxy2LUSDBalance = (await owner2Proxy.lusdBalance()).toString();
    //   assert.equal(proxyLUSDBalance, tokens("10"));
    //   assert.equal(proxy2LUSDBalance, tokens("25"));
    //   assert.equal(userBalance, tokens("990"));
    //   assert.equal(userBalance2, tokens("975"));
    //   assert.equal(stabilityBalance, tokens("35"));
    //   assert.equal(proxyBalance, tokens("0"));
    //   assert.equal(proxyBalance2, tokens("0"));
    // });
    // it("2 users deposit in pool then 1 withdraws", async () => {
    //   const owner = accounts[0];
    //   const owner2 = accounts[1];
    //   const { ownerProxy, owner2Proxy } = await handleDeposit();
    //   let userBalance = (await lusdToken.balanceOf(owner.address)).toString();
    //   let userBalance2 = (await lusdToken.balanceOf(owner2.address)).toString();
    //   let proxyBalance = (
    //     await lusdToken.balanceOf(ownerProxy.address)
    //   ).toString();
    //   let proxyBalance2 = (
    //     await lusdToken.balanceOf(owner2Proxy.address)
    //   ).toString();
    //   let stabilityBalance = (
    //     await lusdToken.balanceOf(stabilityPool.address)
    //   ).toString();
    //   let proxyLUSDBalance = (await ownerProxy.lusdBalance()).toString();
    //   let proxy2LUSDBalance = (await owner2Proxy.lusdBalance()).toString();
    //   assert.equal(proxyLUSDBalance, tokens("10"));
    //   assert.equal(proxy2LUSDBalance, tokens("50"));
    //   assert.equal(userBalance, tokens("990"));
    //   assert.equal(userBalance2, tokens("950"));
    //   assert.equal(stabilityBalance, tokens("60"));
    //   assert.equal(proxyBalance, tokens("0"));
    //   assert.equal(proxyBalance2, tokens("0"));
    //   await owner2Proxy.withdraw(tokens("50"), { from: owner2.address });
    //   userBalance = (await lusdToken.balanceOf(owner.address)).toString();
    //   userBalance2 = (await lusdToken.balanceOf(owner2.address)).toString();
    //   proxyBalance = (await lusdToken.balanceOf(ownerProxy.address)).toString();
    //   proxyBalance2 = (
    //     await lusdToken.balanceOf(owner2Proxy.address)
    //   ).toString();
    //   stabilityBalance = (
    //     await lusdToken.balanceOf(stabilityPool.address)
    //   ).toString();
    //   proxyLUSDBalance = (await ownerProxy.lusdBalance()).toString();
    //   proxy2LUSDBalance = (await owner2Proxy.lusdBalance()).toString();
    //   assert.equal(proxyLUSDBalance, tokens("10"));
    //   assert.equal(proxy2LUSDBalance, tokens("0"));
    //   assert.equal(userBalance, tokens("990"));
    //   assert.equal(userBalance2, tokens("1000"));
    //   assert.equal(stabilityBalance, tokens("10"));
    //   assert.equal(proxyBalance, tokens("0"));
    //   assert.equal(proxyBalance2, tokens("0"));
    // });
    // it("2 users deposit in pool 1 then both withdraws half", async () => {
    //   const owner = accounts[0];
    //   const owner2 = accounts[1];
    //   const { ownerProxy, owner2Proxy } = await handleDeposit();
    //   let userBalance = (await lusdToken.balanceOf(owner.address)).toString();
    //   let userBalance2 = (await lusdToken.balanceOf(owner2.address)).toString();
    //   let proxyBalance = (
    //     await lusdToken.balanceOf(ownerProxy.address)
    //   ).toString();
    //   let proxyBalance2 = (
    //     await lusdToken.balanceOf(owner2Proxy.address)
    //   ).toString();
    //   let stabilityBalance = (
    //     await lusdToken.balanceOf(stabilityPool.address)
    //   ).toString();
    //   let proxyLUSDBalance = (await ownerProxy.lusdBalance()).toString();
    //   let proxy2LUSDBalance = (await owner2Proxy.lusdBalance()).toString();
    //   assert.equal(proxyLUSDBalance, tokens("10"));
    //   assert.equal(proxy2LUSDBalance, tokens("50"));
    //   assert.equal(userBalance, tokens("990"));
    //   assert.equal(userBalance2, tokens("950"));
    //   assert.equal(stabilityBalance, tokens("60"));
    //   assert.equal(proxyBalance, tokens("0"));
    //   assert.equal(proxyBalance2, tokens("0"));
    //   await owner2Proxy.withdraw(tokens("25"), { from: owner2.address });
    //   await ownerProxy.withdraw(tokens("5"), { from: owner.address });
    //   userBalance = (await lusdToken.balanceOf(owner.address)).toString();
    //   userBalance2 = (await lusdToken.balanceOf(owner2.address)).toString();
    //   proxyBalance = (await lusdToken.balanceOf(ownerProxy.address)).toString();
    //   proxyBalance2 = (
    //     await lusdToken.balanceOf(owner2Proxy.address)
    //   ).toString();
    //   stabilityBalance = (
    //     await lusdToken.balanceOf(stabilityPool.address)
    //   ).toString();
    //   proxyLUSDBalance = (await ownerProxy.lusdBalance()).toString();
    //   proxy2LUSDBalance = (await owner2Proxy.lusdBalance()).toString();
    //   assert.equal(proxyLUSDBalance, tokens("5"));
    //   assert.equal(proxy2LUSDBalance, tokens("25"));
    //   assert.equal(userBalance, tokens("995"));
    //   assert.equal(userBalance2, tokens("975"));
    //   assert.equal(stabilityBalance, tokens("30"));
    //   assert.equal(proxyBalance, tokens("0"));
    //   assert.equal(proxyBalance2, tokens("0"));
    // });
    // it("2 users deposit in pool 1 then both withdraw ", async () => {
    //   const owner = accounts[0];
    //   const owner2 = accounts[1];
    //   const { ownerProxy, owner2Proxy } = await handleDeposit();
    //   let userBalance = (await lusdToken.balanceOf(owner.address)).toString();
    //   let userBalance2 = (await lusdToken.balanceOf(owner2.address)).toString();
    //   let proxyBalance = (
    //     await lusdToken.balanceOf(ownerProxy.address)
    //   ).toString();
    //   let proxyBalance2 = (
    //     await lusdToken.balanceOf(owner2Proxy.address)
    //   ).toString();
    //   let stabilityBalance = (
    //     await lusdToken.balanceOf(stabilityPool.address)
    //   ).toString();
    //   let proxyLUSDBalance = (await ownerProxy.lusdBalance()).toString();
    //   let proxy2LUSDBalance = (await owner2Proxy.lusdBalance()).toString();
    //   assert.equal(proxyLUSDBalance, tokens("10"));
    //   assert.equal(proxy2LUSDBalance, tokens("50"));
    //   assert.equal(userBalance, tokens("990"));
    //   assert.equal(userBalance2, tokens("950"));
    //   assert.equal(stabilityBalance, tokens("60"));
    //   assert.equal(proxyBalance, tokens("0"));
    //   assert.equal(proxyBalance2, tokens("0"));
    //   await owner2Proxy.withdraw(tokens("50"), { from: owner2.address });
    //   await ownerProxy.withdraw(tokens("10"), { from: owner.address });
    //   userBalance = (await lusdToken.balanceOf(owner.address)).toString();
    //   userBalance2 = (await lusdToken.balanceOf(owner2.address)).toString();
    //   proxyBalance = (await lusdToken.balanceOf(ownerProxy.address)).toString();
    //   proxyBalance2 = (
    //     await lusdToken.balanceOf(owner2Proxy.address)
    //   ).toString();
    //   stabilityBalance = (
    //     await lusdToken.balanceOf(stabilityPool.address)
    //   ).toString();
    //   proxyLUSDBalance = (await ownerProxy.lusdBalance()).toString();
    //   proxy2LUSDBalance = (await owner2Proxy.lusdBalance()).toString();
    //   assert.equal(proxyLUSDBalance, tokens("0"));
    //   assert.equal(proxy2LUSDBalance, tokens("0"));
    //   assert.equal(userBalance, tokens("1000"));
    //   assert.equal(userBalance2, tokens("1000"));
    //   assert.equal(stabilityBalance, tokens("0"));
    //   assert.equal(proxyBalance, tokens("0"));
    //   assert.equal(proxyBalance2, tokens("0"));
    // });
    // it("2 users deposit in pool 1 overwithdraws ", async () => {
    //   const owner = accounts[0];
    //   const owner2 = accounts[1];
    //   const { ownerProxy, owner2Proxy } = await handleDeposit();
    //   let userBalance = (await lusdToken.balanceOf(owner.address)).toString();
    //   let userBalance2 = (await lusdToken.balanceOf(owner2.address)).toString();
    //   let proxyBalance = (
    //     await lusdToken.balanceOf(ownerProxy.address)
    //   ).toString();
    //   let proxyBalance2 = (
    //     await lusdToken.balanceOf(owner2Proxy.address)
    //   ).toString();
    //   let stabilityBalance = (
    //     await lusdToken.balanceOf(stabilityPool.address)
    //   ).toString();
    //   let proxyLUSDBalance = (await ownerProxy.lusdBalance()).toString();
    //   let proxy2LUSDBalance = (await owner2Proxy.lusdBalance()).toString();
    //   assert.equal(proxyLUSDBalance, tokens("10"));
    //   assert.equal(proxy2LUSDBalance, tokens("50"));
    //   assert.equal(userBalance, tokens("990"));
    //   assert.equal(userBalance2, tokens("950"));
    //   assert.equal(stabilityBalance, tokens("60"));
    //   assert.equal(proxyBalance, tokens("0"));
    //   assert.equal(proxyBalance2, tokens("0"));
    //   try {
    //     await ownerProxy.withdraw(tokens("50"), { from: owner.address });
    //   } catch (err) {
    //     assert(
    //       err.message.indexOf("revert") >= 0,
    //       "error message must contain revert"
    //     );
    //   }
    // });
    // it("rewards for 2 depositers", async () => {
    //   const owner = accounts[0];
    //   const owner2 = accounts[1];
    //   const { ownerProxy, owner2Proxy } = await handleDeposit();
    //   //    causes 1 full block reward to go to first depositer
    //   //   11 blocks
    //   const stringPerBlock = await stabilityFactory.stringPerBlock();
    //   await advanceBlock(10);
    //   let totalRewards = await stringToken.balanceOf(stabilityFactory.address);
    //   //    12 blocks
    //   await ownerProxy.withdraw(tokens("10"), { from: owner.address });
    //   totalRewards = await stringToken.balanceOf(stabilityFactory.address);
    //   //    13 blocks
    //   await owner2Proxy.withdraw(tokens("50"), { from: owner2.address });
    //   totalRewards = await stringToken.balanceOf(stabilityFactory.address);
    //   const rewards = await stringToken.balanceOf(owner.address);
    //   const rewards2 = await stringToken.balanceOf(owner2.address);
    //   const newBlocks = 13;
    //   const num = new BigNumber(stringPerBlock.toString());
    //   const temp = new BigNumber(stringPerBlock.toString());
    //   console.log(`String Per Block:${stringPerBlock.toString()}`);
    //   const expectedRewards = num.times(newBlocks).times(5);
    //   const owner1Balance = num
    //     .times(11)
    //     .times(5)
    //     .times(1 / 6)
    //     .plus(temp.times(5));
    //   const owner2Balance = num
    //     .times(11)
    //     .times(5)
    //     .times(5 / 6)
    //     .plus(temp.times(5));
    //   console.log(`total rewards expected:${expectedRewards.toString()}`);
    //   console.log(`total rewards actual:${totalRewards.toString()}`);
    //   console.log(`owner share of rewards: ${owner1Balance.toString()}`);
    //   console.log(`owner2 share of rewards: ${owner2Balance.toString()}`);
    //   console.log(`actual rewards: ${rewards.toString()}`);
    //   console.log(`actual rewards2: ${rewards2.toString()}`);
    //   assert.equal(
    //     truncateString(rewards.toString()),
    //     truncateString(owner1Balance.toString())
    //   );
    //   assert.equal(
    //     truncateString(rewards2.toString()),
    //     truncateString(owner2Balance.toString())
    //   );
    // });
    // it("Check Boosted logic", async () => {
    //   const owner = accounts[0];
    //   const owner2 = accounts[1];
    //   const { ownerProxy, owner2Proxy } = await handleDeposit();
    //   await advanceBlock(300);
    //   await ownerProxy.withdraw(tokens("10"), { from: owner.address });
    //   let isBoosted = await stabilityFactory.isBoosted();
    //   assert.equal(isBoosted, false);
    // });
  });
});
