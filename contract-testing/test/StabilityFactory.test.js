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

const trunc = (str) => {
  return str.substr(0, 7);
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

contract("Factory and Proxy Tests", () => {
  let contracts,
    accounts,
    harpContracts,
    stringToken,
    lusdToken,
    lqtyToken,
    stabilityFactory,
    stabilityPool,
    stringStaking,
    testSend;

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
    testSend = harpContracts.testSend;
    await stringToken.addMinter(stabilityFactory.address);
    await stringToken.addMinter(accounts[0].address);
  });

  describe("Stability Factory attributes on deployment", async () => {
    it("Sets correct frontend", async () => {
      const started = await stabilityFactory.frontEnd();
      assert.equal(started, stringStaking.address);
    });
    it("Sets correct stringtoken address", async () => {
      const started = await stabilityFactory.stringToken();
      assert.equal(started, stringToken.address);
    });
    it("Sets correct stabilityPool address", async () => {
      const started = await stabilityFactory.stabilityPool();
      assert.equal(started, stabilityPool.address);
    });
    it("Sets correct lqtyToken address", async () => {
      const started = await stabilityFactory.lqtyToken();
      assert.equal(started, lqtyToken.address);
    });
    it("Sets correct lusdToken address", async () => {
      const started = await stabilityFactory.lusdToken();
      assert.equal(started, lusdToken.address);
    });
    it("Sets correct rewardperblock", async () => {
      const reward = await stabilityFactory.stringPerBlock();
      assert.equal(reward.toString(), tokens("0.9230769231"));
    });
  });

  describe("Farm actions", async () => {
    it("deploy proxies", async () => {
      const owner = accounts[0];
      const owner2 = accounts[1];
      const owner3 = accounts[2];
      await stabilityFactory.connect(owner).createStabilityProxy();
      await stabilityFactory.connect(owner2).createStabilityProxy();
      await stabilityFactory.connect(owner3).createStabilityProxy();
      const ownerProxyAddr = await stabilityFactory.userProxys(owner.address);
      const owner2ProxyAddr = await stabilityFactory.userProxys(owner2.address);
      const owner3ProxyAddr = await stabilityFactory.userProxys(owner3.address);
      //   console.log(ownerProxyAddr.proxyAddress);
      const ownerProxy = await StabilityProxy.at(ownerProxyAddr.proxyAddress);
      const owner2Proxy = await StabilityProxy.at(owner2ProxyAddr.proxyAddress);
      const owner3Proxy = await StabilityProxy.at(owner3ProxyAddr.proxyAddress);
      const addr = await ownerProxy.owner();
      const addr2 = await owner2Proxy.owner();
      const addr3 = await owner3Proxy.owner();
      console.log(addr);
      console.log(addr2);
      console.log(addr3);
      console.log();
      assert.equal(owner.address, addr);
      assert.equal(owner2.address, addr2);
      assert.equal(owner3.address, addr3);
    });
    const deployProxies = async () => {
      const owner = accounts[0];
      const owner2 = accounts[1];
      const owner3 = accounts[2];
      const owner4 = accounts[3];
      await stabilityFactory.connect(owner).createStabilityProxy();
      await stabilityFactory.connect(owner2).createStabilityProxy();
      await stabilityFactory.connect(owner3).createStabilityProxy();
      await stabilityFactory.connect(owner4).createStabilityProxy();
      const ownerProxyAddr = await stabilityFactory.userProxys(owner.address);
      const owner2ProxyAddr = await stabilityFactory.userProxys(owner2.address);
      const owner3ProxyAddr = await stabilityFactory.userProxys(owner3.address);
      const owner4ProxyAddr = await stabilityFactory.userProxys(owner4.address);
      //   console.log(ownerProxyAddr.proxyAddress);
      const ownerProxy = await StabilityProxy.at(ownerProxyAddr.proxyAddress);
      const owner2Proxy = await StabilityProxy.at(owner2ProxyAddr.proxyAddress);
      const owner3Proxy = await StabilityProxy.at(owner3ProxyAddr.proxyAddress);
      const owner4Proxy = await StabilityProxy.at(owner4ProxyAddr.proxyAddress);
      return { ownerProxy, owner2Proxy, owner3Proxy, owner4Proxy };
    };
    const mintLUSD = async () => {
      const owner = accounts[0];
      const owner2 = accounts[1];
      const owner3 = accounts[2];
      const owner4 = accounts[3];
      await lusdToken.mintTo(owner.address, tokens("1000"), {
        from: owner.address,
      });
      await lusdToken.mintTo(owner2.address, tokens("1000"), {
        from: owner2.address,
      });
      await lusdToken.mintTo(owner3.address, tokens("1000"), {
        from: owner3.address,
      });
      await lusdToken.mintTo(owner4.address, tokens("1000"), {
        from: owner4.address,
      });
    };
    it("deploy proxy then deposit", async () => {
      let owner = accounts[0];
      await mintLUSD();
      const { ownerProxy } = await deployProxies();
      await lusdToken.approve(ownerProxy.address, tokens("100"), {
        from: owner.address,
      });
      await ownerProxy.deposit(tokens("10"), { from: owner.address });
      const userBalance = (await lusdToken.balanceOf(owner.address)).toString();
      const proxyBalance = (
        await lusdToken.balanceOf(ownerProxy.address)
      ).toString();
      const proxyLUSDBalance = await ownerProxy.lusdBalance();
      const stabilityBalance = await lusdToken.balanceOf(stabilityPool.address);
      const userAccount = (await stabilityFactory.userProxys(owner.address))
        .amount;
      assert.equal(userAccount, tokens("10"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(proxyBalance, tokens("0"));
      assert.equal(proxyLUSDBalance, tokens("10"));
      assert.equal(stabilityBalance, tokens("10"));
    });
    const withdrawCheckROI = async (proxy) => {
      let owner = accounts[0];
      await proxy.withdraw(tokens("10"), { from: owner.address });
      const userBalance = (await lusdToken.balanceOf(owner.address)).toString();
      const proxyBalance = (
        await lusdToken.balanceOf(proxy.address)
      ).toString();
      const stabilityBalance = (
        await lusdToken.balanceOf(stabilityPool.address)
      ).toString();
      const proxyLUSDBalance = await proxy.lusdBalance();
      const rewards = await stringToken.balanceOf(owner.address);
      const stringPerBlock = await stabilityFactory.stringPerBlock();
      const expectedRewards = stringPerBlock.mul(5).mul(11);
      assert.equal(rewards.toString(), expectedRewards.toString());
      assert.equal(userBalance, tokens("1000"));
      assert.equal(proxyBalance, tokens("0"));
      assert.equal(stabilityBalance, tokens("0"));
      assert.equal(proxyLUSDBalance, tokens("0"));
    };
    const claimCheckROI = async (proxy) => {
      let owner = accounts[0];
      await proxy.claim(false, { from: owner.address });
      const userBalance = (await lusdToken.balanceOf(owner.address)).toString();
      const proxyBalance = (
        await lusdToken.balanceOf(proxy.address)
      ).toString();
      const stabilityBalance = (
        await lusdToken.balanceOf(stabilityPool.address)
      ).toString();
      const proxyLUSDBalance = await proxy.lusdBalance();
      const rewards = await stringToken.balanceOf(owner.address);
      const stringPerBlock = await stabilityFactory.stringPerBlock();
      const expectedRewards = stringPerBlock.mul(5).mul(11);
      assert.equal(rewards.toString(), expectedRewards.toString());
      assert.equal(userBalance, tokens("990"));
      assert.equal(proxyBalance, tokens("0"));
      assert.equal(proxyLUSDBalance, tokens("10"));
      assert.equal(stabilityBalance, tokens("10"));
    };
    it("withdraw full from pool", async () => {
      let owner = accounts[0];
      await mintLUSD();
      const { ownerProxy } = await deployProxies();
      await lusdToken.approve(ownerProxy.address, tokens("100"), {
        from: owner.address,
      });
      await ownerProxy.deposit(tokens("10"), { from: owner.address });
      //    goes 1 extra
      await advanceBlock(10);
      await withdrawCheckROI(ownerProxy);
    });
    it("claim from pool", async () => {
      let owner = accounts[0];
      await mintLUSD();
      const { ownerProxy } = await deployProxies();
      await lusdToken.approve(ownerProxy.address, tokens("100"), {
        from: owner.address,
      });
      await ownerProxy.deposit(tokens("10"), { from: owner.address });
      //    goes 1 extra
      await advanceBlock(10);
      await claimCheckROI(ownerProxy);
    });
    const handleDepositOrig = async () => {
      const owner = accounts[0];
      const owner2 = accounts[1];
      const owner3 = accounts[2];
      const owner4 = accounts[3];
      await mintLUSD();
      const { ownerProxy, owner2Proxy } = await deployProxies();
      await lusdToken.approve(ownerProxy.address, tokens("10000"), {
        from: owner.address,
      });
      await lusdToken.approve(owner2Proxy.address, tokens("10000"), {
        from: owner2.address,
      });
      await ownerProxy.deposit(tokens("10"), { from: owner.address });
      await owner2Proxy.deposit(tokens("50"), { from: owner2.address });
      return { ownerProxy, owner2Proxy };
    };
    const handleDeposit = async () => {
      const owner = accounts[0];
      const owner2 = accounts[1];
      const owner3 = accounts[2];
      const owner4 = accounts[3];
      await mintLUSD();
      const {
        ownerProxy,
        owner2Proxy,
        owner3Proxy,
        owner4Proxy,
      } = await deployProxies();
      await lusdToken.approve(ownerProxy.address, tokens("10000"), {
        from: owner.address,
      });
      await lusdToken.approve(owner2Proxy.address, tokens("10000"), {
        from: owner2.address,
      });
      await lusdToken.approve(owner3Proxy.address, tokens("10000"), {
        from: owner3.address,
      });
      await lusdToken.approve(owner4Proxy.address, tokens("10000"), {
        from: owner4.address,
      });
      await ownerProxy.deposit(tokens("10"), { from: owner.address });
      await owner2Proxy.deposit(tokens("50"), { from: owner2.address });
      await owner3Proxy.deposit(tokens("60"), { from: owner3.address });
      await owner4Proxy.deposit(tokens("30"), { from: owner4.address });
      return { ownerProxy, owner2Proxy, owner3Proxy, owner4Proxy };
    };
    it("2 users deposit in pool 1", async () => {
      const owner = accounts[0];
      const owner2 = accounts[1];
      const { ownerProxy, owner2Proxy } = await handleDeposit();
      const userBalance = (await lusdToken.balanceOf(owner.address)).toString();
      const userBalance2 = (
        await lusdToken.balanceOf(owner2.address)
      ).toString();
      const proxyBalance = (
        await lusdToken.balanceOf(ownerProxy.address)
      ).toString();
      const proxyBalance2 = (
        await lusdToken.balanceOf(owner2Proxy.address)
      ).toString();
      const stabilityBalance = (
        await lusdToken.balanceOf(stabilityPool.address)
      ).toString();
      const proxyLUSDBalance = (await ownerProxy.lusdBalance()).toString();
      const proxy2LUSDBalance = (await owner2Proxy.lusdBalance()).toString();
      assert.equal(proxyLUSDBalance, tokens("10"));
      assert.equal(proxy2LUSDBalance, tokens("50"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(userBalance2, tokens("950"));
      assert.equal(stabilityBalance, tokens("150"));
      assert.equal(proxyBalance, tokens("0"));
      assert.equal(proxyBalance2, tokens("0"));
    });
    it("2 users deposit in pool then 1 withdraws half", async () => {
      const owner = accounts[0];
      const owner2 = accounts[1];
      const { ownerProxy, owner2Proxy } = await handleDeposit();
      let userBalance = (await lusdToken.balanceOf(owner.address)).toString();
      let userBalance2 = (await lusdToken.balanceOf(owner2.address)).toString();
      let proxyBalance = (
        await lusdToken.balanceOf(ownerProxy.address)
      ).toString();
      let proxyBalance2 = (
        await lusdToken.balanceOf(owner2Proxy.address)
      ).toString();
      let stabilityBalance = (
        await lusdToken.balanceOf(stabilityPool.address)
      ).toString();
      let proxyLUSDBalance = (await ownerProxy.lusdBalance()).toString();
      let proxy2LUSDBalance = (await owner2Proxy.lusdBalance()).toString();
      assert.equal(proxyLUSDBalance, tokens("10"));
      assert.equal(proxy2LUSDBalance, tokens("50"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(userBalance2, tokens("950"));
      assert.equal(stabilityBalance, tokens("150"));
      assert.equal(proxyBalance, tokens("0"));
      assert.equal(proxyBalance2, tokens("0"));
      await owner2Proxy.withdraw(tokens("25"), { from: owner2.address });
      userBalance = (await lusdToken.balanceOf(owner.address)).toString();
      userBalance2 = (await lusdToken.balanceOf(owner2.address)).toString();
      proxyBalance = (await lusdToken.balanceOf(ownerProxy.address)).toString();
      proxyBalance2 = (
        await lusdToken.balanceOf(owner2Proxy.address)
      ).toString();
      stabilityBalance = (
        await lusdToken.balanceOf(stabilityPool.address)
      ).toString();
      proxyLUSDBalance = (await ownerProxy.lusdBalance()).toString();
      proxy2LUSDBalance = (await owner2Proxy.lusdBalance()).toString();
      assert.equal(proxyLUSDBalance, tokens("10"));
      assert.equal(proxy2LUSDBalance, tokens("25"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(userBalance2, tokens("975"));
      assert.equal(stabilityBalance, tokens("125"));
      assert.equal(proxyBalance, tokens("0"));
      assert.equal(proxyBalance2, tokens("0"));
    });
    it("2 users deposit in pool then 1 withdraws", async () => {
      const owner = accounts[0];
      const owner2 = accounts[1];
      const { ownerProxy, owner2Proxy } = await handleDeposit();
      let userBalance = (await lusdToken.balanceOf(owner.address)).toString();
      let userBalance2 = (await lusdToken.balanceOf(owner2.address)).toString();
      let proxyBalance = (
        await lusdToken.balanceOf(ownerProxy.address)
      ).toString();
      let proxyBalance2 = (
        await lusdToken.balanceOf(owner2Proxy.address)
      ).toString();
      let stabilityBalance = (
        await lusdToken.balanceOf(stabilityPool.address)
      ).toString();
      let proxyLUSDBalance = (await ownerProxy.lusdBalance()).toString();
      let proxy2LUSDBalance = (await owner2Proxy.lusdBalance()).toString();
      assert.equal(proxyLUSDBalance, tokens("10"));
      assert.equal(proxy2LUSDBalance, tokens("50"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(userBalance2, tokens("950"));
      assert.equal(stabilityBalance, tokens("150"));
      assert.equal(proxyBalance, tokens("0"));
      assert.equal(proxyBalance2, tokens("0"));
      await owner2Proxy.withdraw(tokens("50"), { from: owner2.address });
      userBalance = (await lusdToken.balanceOf(owner.address)).toString();
      userBalance2 = (await lusdToken.balanceOf(owner2.address)).toString();
      proxyBalance = (await lusdToken.balanceOf(ownerProxy.address)).toString();
      proxyBalance2 = (
        await lusdToken.balanceOf(owner2Proxy.address)
      ).toString();
      stabilityBalance = (
        await lusdToken.balanceOf(stabilityPool.address)
      ).toString();
      proxyLUSDBalance = (await ownerProxy.lusdBalance()).toString();
      proxy2LUSDBalance = (await owner2Proxy.lusdBalance()).toString();
      assert.equal(proxyLUSDBalance, tokens("10"));
      assert.equal(proxy2LUSDBalance, tokens("0"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(userBalance2, tokens("1000"));
      assert.equal(stabilityBalance, tokens("100"));
      assert.equal(proxyBalance, tokens("0"));
      assert.equal(proxyBalance2, tokens("0"));
    });
    it("2 users deposit in pool 1 then both withdraws half", async () => {
      const owner = accounts[0];
      const owner2 = accounts[1];
      const { ownerProxy, owner2Proxy } = await handleDeposit();
      let userBalance = (await lusdToken.balanceOf(owner.address)).toString();
      let userBalance2 = (await lusdToken.balanceOf(owner2.address)).toString();
      let proxyBalance = (
        await lusdToken.balanceOf(ownerProxy.address)
      ).toString();
      let proxyBalance2 = (
        await lusdToken.balanceOf(owner2Proxy.address)
      ).toString();
      let stabilityBalance = (
        await lusdToken.balanceOf(stabilityPool.address)
      ).toString();
      let proxyLUSDBalance = (await ownerProxy.lusdBalance()).toString();
      let proxy2LUSDBalance = (await owner2Proxy.lusdBalance()).toString();
      assert.equal(proxyLUSDBalance, tokens("10"));
      assert.equal(proxy2LUSDBalance, tokens("50"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(userBalance2, tokens("950"));
      assert.equal(stabilityBalance, tokens("150"));
      assert.equal(proxyBalance, tokens("0"));
      assert.equal(proxyBalance2, tokens("0"));
      await owner2Proxy.withdraw(tokens("25"), { from: owner2.address });
      await ownerProxy.withdraw(tokens("5"), { from: owner.address });
      userBalance = (await lusdToken.balanceOf(owner.address)).toString();
      userBalance2 = (await lusdToken.balanceOf(owner2.address)).toString();
      proxyBalance = (await lusdToken.balanceOf(ownerProxy.address)).toString();
      proxyBalance2 = (
        await lusdToken.balanceOf(owner2Proxy.address)
      ).toString();
      stabilityBalance = (
        await lusdToken.balanceOf(stabilityPool.address)
      ).toString();
      proxyLUSDBalance = (await ownerProxy.lusdBalance()).toString();
      proxy2LUSDBalance = (await owner2Proxy.lusdBalance()).toString();
      assert.equal(proxyLUSDBalance, tokens("5"));
      assert.equal(proxy2LUSDBalance, tokens("25"));
      assert.equal(userBalance, tokens("995"));
      assert.equal(userBalance2, tokens("975"));
      assert.equal(stabilityBalance, tokens("120"));
      assert.equal(proxyBalance, tokens("0"));
      assert.equal(proxyBalance2, tokens("0"));
    });
    it("2 users deposit in pool 1 then both withdraw ", async () => {
      const owner = accounts[0];
      const owner2 = accounts[1];
      const { ownerProxy, owner2Proxy } = await handleDeposit();
      let userBalance = (await lusdToken.balanceOf(owner.address)).toString();
      let userBalance2 = (await lusdToken.balanceOf(owner2.address)).toString();
      let proxyBalance = (
        await lusdToken.balanceOf(ownerProxy.address)
      ).toString();
      let proxyBalance2 = (
        await lusdToken.balanceOf(owner2Proxy.address)
      ).toString();
      let stabilityBalance = (
        await lusdToken.balanceOf(stabilityPool.address)
      ).toString();
      let proxyLUSDBalance = (await ownerProxy.lusdBalance()).toString();
      let proxy2LUSDBalance = (await owner2Proxy.lusdBalance()).toString();
      assert.equal(proxyLUSDBalance, tokens("10"));
      assert.equal(proxy2LUSDBalance, tokens("50"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(userBalance2, tokens("950"));
      assert.equal(stabilityBalance, tokens("150"));
      assert.equal(proxyBalance, tokens("0"));
      assert.equal(proxyBalance2, tokens("0"));
      await owner2Proxy.withdraw(tokens("50"), { from: owner2.address });
      await ownerProxy.withdraw(tokens("10"), { from: owner.address });
      userBalance = (await lusdToken.balanceOf(owner.address)).toString();
      userBalance2 = (await lusdToken.balanceOf(owner2.address)).toString();
      proxyBalance = (await lusdToken.balanceOf(ownerProxy.address)).toString();
      proxyBalance2 = (
        await lusdToken.balanceOf(owner2Proxy.address)
      ).toString();
      stabilityBalance = (
        await lusdToken.balanceOf(stabilityPool.address)
      ).toString();
      proxyLUSDBalance = (await ownerProxy.lusdBalance()).toString();
      proxy2LUSDBalance = (await owner2Proxy.lusdBalance()).toString();
      assert.equal(proxyLUSDBalance, tokens("0"));
      assert.equal(proxy2LUSDBalance, tokens("0"));
      assert.equal(userBalance, tokens("1000"));
      assert.equal(userBalance2, tokens("1000"));
      assert.equal(stabilityBalance, tokens("90"));
      assert.equal(proxyBalance, tokens("0"));
      assert.equal(proxyBalance2, tokens("0"));
    });
    it("2 users deposit in pool 1 overwithdraws ", async () => {
      const owner = accounts[0];
      const owner2 = accounts[1];
      const { ownerProxy, owner2Proxy } = await handleDeposit();
      let userBalance = (await lusdToken.balanceOf(owner.address)).toString();
      let userBalance2 = (await lusdToken.balanceOf(owner2.address)).toString();
      let proxyBalance = (
        await lusdToken.balanceOf(ownerProxy.address)
      ).toString();
      let proxyBalance2 = (
        await lusdToken.balanceOf(owner2Proxy.address)
      ).toString();
      let stabilityBalance = (
        await lusdToken.balanceOf(stabilityPool.address)
      ).toString();
      let proxyLUSDBalance = (await ownerProxy.lusdBalance()).toString();
      let proxy2LUSDBalance = (await owner2Proxy.lusdBalance()).toString();
      assert.equal(proxyLUSDBalance, tokens("10"));
      assert.equal(proxy2LUSDBalance, tokens("50"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(userBalance2, tokens("950"));
      assert.equal(stabilityBalance, tokens("150"));
      assert.equal(proxyBalance, tokens("0"));
      assert.equal(proxyBalance2, tokens("0"));
      try {
        await ownerProxy.withdraw(tokens("50"), { from: owner.address });
      } catch (err) {
        assert(
          err.message.indexOf("revert") >= 0,
          "error message must contain revert"
        );
      }
    });
    it("rewards for 2 depositers", async () => {
      const owner = accounts[0];
      const owner2 = accounts[1];
      const { ownerProxy, owner2Proxy } = await handleDepositOrig();
      //    causes 1 full block reward to go to first depositer
      //   11 blocks
      const stringPerBlock = await stabilityFactory.stringPerBlock();
      await advanceBlock(10);
      let totalRewards = await stringToken.balanceOf(stabilityFactory.address);
      //    12 blocks
      await ownerProxy.withdraw(tokens("10"), { from: owner.address });
      totalRewards = await stringToken.balanceOf(stabilityFactory.address);
      //    13 blocks
      await owner2Proxy.withdraw(tokens("50"), { from: owner2.address });
      totalRewards = await stringToken.balanceOf(stabilityFactory.address);
      const rewards = await stringToken.balanceOf(owner.address);
      const rewards2 = await stringToken.balanceOf(owner2.address);
      const newBlocks = 13;
      const num = new BigNumber(stringPerBlock.toString());
      const temp = new BigNumber(stringPerBlock.toString());
      console.log(`String Per Block:${stringPerBlock.toString()}`);
      const expectedRewards = num.times(newBlocks).times(5);
      const owner1Balance = num
        .times(11)
        .times(5)
        .times(1 / 6)
        .plus(temp.times(5));
      const owner2Balance = num
        .times(11)
        .times(5)
        .times(5 / 6)
        .plus(temp.times(5));
      console.log(`total rewards expected:${expectedRewards.toString()}`);
      console.log(`total rewards actual:${totalRewards.toString()}`);
      console.log(`owner share of rewards: ${owner1Balance.toString()}`);
      console.log(`owner2 share of rewards: ${owner2Balance.toString()}`);
      console.log(`actual rewards: ${rewards.toString()}`);
      console.log(`actual rewards2: ${rewards2.toString()}`);
      assert.equal(trunc(rewards.toString()), trunc(owner1Balance.toString()));
      assert.equal(trunc(rewards2.toString()), trunc(owner2Balance.toString()));
    });
    it("Check Boosted logic", async () => {
      const owner = accounts[0];
      const owner2 = accounts[1];
      const { ownerProxy, owner2Proxy } = await handleDeposit();
      await advanceBlock(300);
      await ownerProxy.withdraw(tokens("10"), { from: owner.address });
      let isBoosted = await stabilityFactory.isBoosted();
      assert.equal(isBoosted, false);
    });
    it("rewards 4 proxies and readjust lusdbalance", async () => {
      const owner = accounts[0];
      const owner2 = accounts[1];
      const owner3 = accounts[2];
      const owner4 = accounts[3];
      const {
        ownerProxy,
        owner2Proxy,
        owner3Proxy,
        owner4Proxy,
      } = await handleDeposit();
      const stringPerBlock = await stabilityFactory.stringPerBlock();
      // INITIAL REWARDS
      // owner 1
      // 1 full block
      // 1/6 block
      // 1/12 block
      let initRewardsO1 = stringPerBlock
        .add(stringPerBlock.mul(1).div(6))
        .add(stringPerBlock.mul(1).div(12));
      // owner 2
      // 5/6 block
      // 5/12 block
      let initRewardsO2 = stringPerBlock
        .mul(5)
        .div(6)
        .add(stringPerBlock.mul(5).div(12));
      // owner 3
      // 1/2 block
      let initRewardsO3 = stringPerBlock.div(2);
      // owner 4
      // 1/5 block
      await owner4Proxy.claim(false, { from: owner4.address });
      const actualBal = await stringToken.balanceOf(owner4.address);
      const expectedBal = stringPerBlock.div(5).mul(5);
      assert.equal(actualBal.toString(), expectedBal.toString());
      // new block
      // owner 1
      // 1/15 block
      initRewardsO1 = initRewardsO1.add(stringPerBlock.div(15));
      // owner 2
      // 1/3 block
      initRewardsO2 = initRewardsO2.add(stringPerBlock.div(3));
      // owner 3
      // 2/5 block
      initRewardsO3 = initRewardsO3.add(stringPerBlock.mul(2).div(5));
      // owner 4
      // 1/5 block
      let initRewardsO4 = expectedBal.add(stringPerBlock.div(5));
      let owner1Pending = await stabilityFactory.pendingString(owner.address);
      let owner2Pending = await stabilityFactory.pendingString(owner2.address);
      let owner3Pending = await stabilityFactory.pendingString(owner3.address);
      let owner4Pending = await stabilityFactory.pendingString(owner4.address);
      assert.equal(
        trunc(owner1Pending.toString()),
        trunc(initRewardsO1.mul(5).toString())
      );
      assert.equal(
        trunc(owner2Pending.toString()),
        trunc(initRewardsO2.mul(5).toString())
      );
      assert.equal(
        trunc(owner3Pending.toString()),
        trunc(initRewardsO3.mul(5).toString())
      );
      // advance 10 blocks
      await advanceBlock(10);
      //new blocks
      // owner 1
      // 1/15 * 10
      initRewardsO1 = initRewardsO1.add(stringPerBlock.div(15).mul(10));
      // owner 2
      // 1/3 * 10
      initRewardsO2 = initRewardsO2.add(stringPerBlock.div(3).mul(11));
      // owner 3
      // 2/5 * 10
      initRewardsO3 = initRewardsO3.add(stringPerBlock.mul(2).div(5).mul(10));
      // owner 4
      // 1/5 * 10
      initRewardsO4 = initRewardsO4.add(stringPerBlock.div(5).mul(10));
      // claim and shift
      await owner2Proxy.withdraw(tokens("10"), { from: owner2.address });
      const owner2Bal = await stringToken.balanceOf(owner2.address);
      assert.equal(
        trunc(owner2Bal.toString()),
        trunc(initRewardsO2.mul(5).toString())
      );
      // new block
      // owner 1
      // 1/15 block
      initRewardsO1 = initRewardsO1.add(stringPerBlock.div(15));
      // owner 2
      // 1/3 block
      // initRewardsO2 = initRewardsO2.add(stringPerBlock.div(3));
      // owner 3
      // 2/5 block
      initRewardsO3 = initRewardsO3.add(stringPerBlock.mul(2).div(5));
      // owner 4
      // 1/5 block
      initRewardsO4 = expectedBal.add(stringPerBlock.mul(1).div(5));
      // advance 10 blocks
      await advanceBlock(10);
      // owner 1
      // 1/14 block
      initRewardsO1 = initRewardsO1.add(stringPerBlock.div(14).mul(11));
      // owner 2
      // 2/7 block
      initRewardsO2 = initRewardsO2.add(stringPerBlock.mul(2).div(7).mul(10));
      // owner 3
      // 3/7 block
      initRewardsO3 = initRewardsO3.add(stringPerBlock.mul(3).div(7).mul(10));
      // owner 4
      // 3/14 block
      initRewardsO4 = initRewardsO4.add(stringPerBlock.mul(3).div(14).mul(10));
      owner1Pending = await stabilityFactory.pendingString(owner.address);
      owner2Pending = await stabilityFactory.pendingString(owner2.address);
      owner3Pending = await stabilityFactory.pendingString(owner3.address);
      owner4Pending = await stabilityFactory.pendingString(owner4.address);
      let totalLUSD = await stabilityFactory.totalLUSD();
      console.log(initRewardsO1.mul(5).toString());
      console.log(owner1Pending.toString());
      assert.equal(totalLUSD.toString(), tokens("140"));
      await ownerProxy.claim(false);
      const ownerBal = await stringToken.balanceOf(owner.address);
      assert.equal(
        trunc(ownerBal.toString()),
        trunc(initRewardsO1.mul(5).toString())
      );
      assert.equal(
        trunc(owner3Pending.toString()),
        trunc(initRewardsO3.mul(5).toString())
      );
      // new block
      // owner 1
      // 1/14 block
      // initRewardsO1 = initRewardsO1.add(stringPerBlock.div(14).mul(11));
      // owner 2
      // 2/7 block
      initRewardsO2 = initRewardsO2.add(stringPerBlock.mul(2).div(7));
      // owner 3
      // 3/7 block
      initRewardsO3 = initRewardsO3.add(stringPerBlock.mul(3).div(7).mul(2));
      // owner 4
      // 3/14 block
      initRewardsO4 = initRewardsO4.add(stringPerBlock.mul(3).div(14));
      await owner3Proxy.claim(true, { from: owner3.address });
      const actualBalo3 = await stringToken.balanceOf(owner3.address);
      assert.equal(
        trunc(actualBalo3.toString()),
        trunc(initRewardsO3.mul(5).toString())
      );
      totalLUSD = await stabilityFactory.totalLUSD();
      let lusdBalance = await owner3Proxy.lusdBalance();
      let proxyBalance = (await stabilityFactory.userProxys(owner3.address))
        .amount;
      assert.equal(totalLUSD.toString(), tokens("110"));
      assert.equal(lusdBalance.toString(), tokens("30"));
      assert.equal(proxyBalance.toString(), tokens("30"));
      // new block
      // owner 1
      // 1/14 block
      initRewardsO1 = initRewardsO1.add(stringPerBlock.div(14).mul(11));
      // owner 2
      // 2/7 block
      initRewardsO2 = initRewardsO2.add(stringPerBlock.mul(2).div(7));
      // owner 3
      // 3/7 block
      // initRewardsO3 = initRewardsO3.add(stringPerBlock.mul(3).div(7).mul(2));
      // owner 4
      // 3/14 block
      initRewardsO4 = initRewardsO4.add(stringPerBlock.mul(3).div(14));
      await advanceBlock(10);
      // owner 1
      // 1/11 block
      initRewardsO1 = initRewardsO1.add(stringPerBlock.div(11).mul(10));
      // owner 2
      // 4/11 block
      initRewardsO2 = initRewardsO2.add(stringPerBlock.mul(4).div(11).mul(10));
      // owner 3
      // 3/7 block
      initRewardsO3 = initRewardsO3.add(stringPerBlock.mul(3).div(11).mul(11));
      // owner 4
      // 3/11 block
      initRewardsO4 = initRewardsO4.add(stringPerBlock.mul(3).div(11).mul(10));
      await owner3Proxy.claim(false, { from: owner3.address });
      const owner3Bal = await stringToken.balanceOf(owner3.address);
      assert.equal(
        trunc(owner3Bal.toString()),
        trunc(initRewardsO3.mul(5).toString())
      );
    });
    it("test send eth and receive eth", async () => {
      const owner = accounts[0];
      const owner2 = accounts[1];
      const {
        ownerProxy,
        owner2Proxy,
        owner3Proxy,
        owner4Proxy,
      } = await handleDeposit();
      await owner2.sendTransaction({
        to: testSend.address,
        value: ethers.utils.parseEther("1"),
      });
      const bal = await owner.provider.getBalance(testSend.address);
      const firstOwnerBal = await owner.getBalance();
      assert.equal(bal, tokens("1"));
      await ownerProxy.TESTclaim();
      const lastOwnerBal = await owner.getBalance();
      assert.equal(firstOwnerBal.lt(lastOwnerBal), true);
    });
    it("test depositing and withdrawing state changes", async () => {
      const owner = accounts[0];
      const owner2 = accounts[1];
      const owner3 = accounts[2];
      const owner4 = accounts[3];
      const {
        ownerProxy,
        owner2Proxy,
        owner3Proxy,
        owner4Proxy,
      } = await handleDeposit();

      await advanceBlock(1000);
      let totalLUSD = await stabilityFactory.totalLUSD();
      let spTotalLUSD = await lusdToken.balanceOf(stabilityPool.address);
      let op1Bal = await ownerProxy.lusdBalance();
      let op1RefBal = (await stabilityFactory.userProxys(owner.address)).amount;
      let op2Bal = await owner2Proxy.lusdBalance();
      let op2RefBal = (await stabilityFactory.userProxys(owner2.address))
        .amount;
      let op3Bal = await owner3Proxy.lusdBalance();
      let op3RefBal = (await stabilityFactory.userProxys(owner3.address))
        .amount;
      let op4Bal = await owner4Proxy.lusdBalance();
      let op4RefBal = (await stabilityFactory.userProxys(owner4.address))
        .amount;

      assert.equal(totalLUSD.toString(), tokens("150"));
      assert.equal(spTotalLUSD.toString(), tokens("150"));
      assert.equal(op1Bal.toString(), tokens("10"));
      assert.equal(op1RefBal.toString(), tokens("10"));
      assert.equal(op2Bal.toString(), tokens("50"));
      assert.equal(op2RefBal.toString(), tokens("50"));
      assert.equal(op3Bal.toString(), tokens("60"));
      assert.equal(op3RefBal.toString(), tokens("60"));
      assert.equal(op4Bal.toString(), tokens("30"));
      assert.equal(op4RefBal.toString(), tokens("30"));

      await ownerProxy.withdraw(tokens("5"));
      await owner2Proxy.withdraw(tokens("5"), { from: owner2.address });
      await owner3Proxy.deposit(tokens("20"), { from: owner3.address });
      await owner4Proxy.deposit(tokens("20"), { from: owner4.address });

      await advanceBlock(1000);
      totalLUSD = await stabilityFactory.totalLUSD();
      spTotalLUSD = await lusdToken.balanceOf(stabilityPool.address);
      op1Bal = await ownerProxy.lusdBalance();
      op1RefBal = (await stabilityFactory.userProxys(owner.address)).amount;
      op2Bal = await owner2Proxy.lusdBalance();
      op2RefBal = (await stabilityFactory.userProxys(owner2.address)).amount;
      op3Bal = await owner3Proxy.lusdBalance();
      op3RefBal = (await stabilityFactory.userProxys(owner3.address)).amount;
      op4Bal = await owner4Proxy.lusdBalance();
      op4RefBal = (await stabilityFactory.userProxys(owner4.address)).amount;

      await advanceBlock(1000);

      assert.equal(totalLUSD.toString(), tokens("180"));
      assert.equal(spTotalLUSD.toString(), tokens("180"));
      assert.equal(op1Bal.toString(), tokens("5"));
      assert.equal(op1RefBal.toString(), tokens("5"));
      assert.equal(op2Bal.toString(), tokens("45"));
      assert.equal(op2RefBal.toString(), tokens("45"));
      assert.equal(op3Bal.toString(), tokens("80"));
      assert.equal(op3RefBal.toString(), tokens("80"));
      assert.equal(op4Bal.toString(), tokens("50"));
      assert.equal(op4RefBal.toString(), tokens("50"));

      await ownerProxy.withdraw(tokens("5"));
      await owner2Proxy.withdraw(tokens("5"), { from: owner2.address });
      await owner3Proxy.deposit(tokens("20"), { from: owner3.address });
      await owner4Proxy.deposit(tokens("20"), { from: owner4.address });

      await advanceBlock(1000);
      totalLUSD = await stabilityFactory.totalLUSD();
      spTotalLUSD = await lusdToken.balanceOf(stabilityPool.address);
      op1Bal = await ownerProxy.lusdBalance();
      op1RefBal = (await stabilityFactory.userProxys(owner.address)).amount;
      op2Bal = await owner2Proxy.lusdBalance();
      op2RefBal = (await stabilityFactory.userProxys(owner2.address)).amount;
      op3Bal = await owner3Proxy.lusdBalance();
      op3RefBal = (await stabilityFactory.userProxys(owner3.address)).amount;
      op4Bal = await owner4Proxy.lusdBalance();
      op4RefBal = (await stabilityFactory.userProxys(owner4.address)).amount;

      assert.equal(totalLUSD.toString(), tokens("210"));
      assert.equal(spTotalLUSD.toString(), tokens("210"));
      assert.equal(op1Bal.toString(), tokens("0"));
      assert.equal(op1RefBal.toString(), tokens("0"));
      assert.equal(op2Bal.toString(), tokens("40"));
      assert.equal(op2RefBal.toString(), tokens("40"));
      assert.equal(op3Bal.toString(), tokens("100"));
      assert.equal(op3RefBal.toString(), tokens("100"));
      assert.equal(op4Bal.toString(), tokens("70"));
      assert.equal(op4RefBal.toString(), tokens("70"));

      await owner4Proxy.claim(true, { from: owner4.address });

      await ownerProxy.deposit(tokens("50"));
      await owner2Proxy.deposit(tokens("50"), { from: owner2.address });
      await owner3Proxy.deposit(tokens("20"), { from: owner3.address });
      await owner4Proxy.deposit(tokens("20"), { from: owner4.address });

      await advanceBlock(1000);
      totalLUSD = await stabilityFactory.totalLUSD();
      spTotalLUSD = await lusdToken.balanceOf(stabilityPool.address);
      op1Bal = await ownerProxy.lusdBalance();
      op1RefBal = (await stabilityFactory.userProxys(owner.address)).amount;
      op2Bal = await owner2Proxy.lusdBalance();
      op2RefBal = (await stabilityFactory.userProxys(owner2.address)).amount;
      op3Bal = await owner3Proxy.lusdBalance();
      op3RefBal = (await stabilityFactory.userProxys(owner3.address)).amount;
      op4Bal = await owner4Proxy.lusdBalance();
      op4RefBal = (await stabilityFactory.userProxys(owner4.address)).amount;

      assert.equal(totalLUSD.toString(), tokens("315"));
      assert.equal(spTotalLUSD.toString(), tokens("350"));
      assert.equal(op1Bal.toString(), tokens("50"));
      assert.equal(op1RefBal.toString(), tokens("50"));
      assert.equal(op2Bal.toString(), tokens("90"));
      assert.equal(op2RefBal.toString(), tokens("90"));
      assert.equal(op3Bal.toString(), tokens("120"));
      assert.equal(op3RefBal.toString(), tokens("120"));
      assert.equal(op4Bal.toString(), tokens("55"));
      assert.equal(op4RefBal.toString(), tokens("55"));

      await owner4Proxy.claim(true, { from: owner4.address });
      await owner3Proxy.claim(true, { from: owner3.address });

      await ownerProxy.withdraw(tokens("5"));
      await owner2Proxy.deposit(tokens("50"), { from: owner2.address });
      await owner3Proxy.withdraw(tokens("10"), { from: owner3.address });
      await owner4Proxy.deposit(tokens("10"), { from: owner4.address });

      await advanceBlock(1000);
      totalLUSD = await stabilityFactory.totalLUSD();
      spTotalLUSD = await lusdToken.balanceOf(stabilityPool.address);
      op1Bal = await ownerProxy.lusdBalance();
      op1RefBal = (await stabilityFactory.userProxys(owner.address)).amount;
      op2Bal = await owner2Proxy.lusdBalance();
      op2RefBal = (await stabilityFactory.userProxys(owner2.address)).amount;
      op3Bal = await owner3Proxy.lusdBalance();
      op3RefBal = (await stabilityFactory.userProxys(owner3.address)).amount;
      op4Bal = await owner4Proxy.lusdBalance();
      op4RefBal = (await stabilityFactory.userProxys(owner4.address)).amount;

      assert.equal(totalLUSD.toString(), tokens("290"));
      // assert.equal(spTotalLUSD.toString(), tokens("277.5"));
      assert.equal(op1Bal.toString(), tokens("45"));
      assert.equal(op1RefBal.toString(), tokens("45"));
      assert.equal(op2Bal.toString(), tokens("140"));
      assert.equal(op2RefBal.toString(), tokens("140"));
      assert.equal(op3Bal.toString(), tokens("50"));
      assert.equal(op3RefBal.toString(), tokens("50"));
      assert.equal(op4Bal.toString(), tokens("55"));
      assert.equal(op4RefBal.toString(), tokens("55"));

      await owner4Proxy.claim(true, { from: owner4.address });
      await owner3Proxy.claim(true, { from: owner3.address });
      await owner2Proxy.claim(true, { from: owner2.address });
      await ownerProxy.claim(true, { from: owner.address });

      await advanceBlock(1000);
      totalLUSD = await stabilityFactory.totalLUSD();
      spTotalLUSD = await lusdToken.balanceOf(stabilityPool.address);
      op1Bal = await ownerProxy.lusdBalance();
      op1RefBal = (await stabilityFactory.userProxys(owner.address)).amount;
      op2Bal = await owner2Proxy.lusdBalance();
      op2RefBal = (await stabilityFactory.userProxys(owner2.address)).amount;
      op3Bal = await owner3Proxy.lusdBalance();
      op3RefBal = (await stabilityFactory.userProxys(owner3.address)).amount;
      op4Bal = await owner4Proxy.lusdBalance();
      op4RefBal = (await stabilityFactory.userProxys(owner4.address)).amount;

      assert.equal(totalLUSD.toString(), tokens("192.5"));
      // assert.equal(spTotalLUSD.toString(), tokens("277.5"));
      assert.equal(op1Bal.toString(), tokens("22.5"));
      assert.equal(op1RefBal.toString(), tokens("22.5"));
      assert.equal(op2Bal.toString(), tokens("70"));
      assert.equal(op2RefBal.toString(), tokens("70"));
      assert.equal(op3Bal.toString(), tokens("50"));
      assert.equal(op3RefBal.toString(), tokens("50"));
      assert.equal(op4Bal.toString(), tokens("50"));
      assert.equal(op4RefBal.toString(), tokens("50"));
    });
  });
});
