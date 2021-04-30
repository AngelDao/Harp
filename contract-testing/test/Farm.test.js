/* eslint-disable jest/valid-describe */
/* eslint-disable no-undef */
const { assert, expect } = require("chai");
const deploymentHelperLiquity = require("../utils/deploymentHelperLiquity");
const deploymentHelperHarp = require("../utils/deploymentHelperHarp");
const { ethers, artifacts } = require("hardhat");
const testHelpers = require("../utils/testHelpers.js");
require("chai").use(require("chai-as-promised")).should();
const StabilityPool = artifacts.require("./StabilityPool.sol");
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
    tokenVesting,
    lusdLP,
    ethLP;

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
    borrowerOperations = contracts.borrowerOperations;

    lqtyToken = LQTYContracts.lqtyToken;
    communityIssuanceTester = LQTYContracts.communityIssuance;

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
    tokenVesting = harpContracts.tokenVesting;
    farm = harpContracts.farm;
    await stringToken.addMinter(accounts[0].address);
    await stringToken.addMinter(tokenVesting.address);
    ethLP = await ethers.getContractFactory("ETHLPTokenTest");
    lusdLP = await ethers.getContractFactory("LUSDLPTokenTest");
    ethLP = await ethLP.deploy(accounts[0].address, accounts[1].address);
    lusdLP = await lusdLP.deploy(accounts[0].address, accounts[1].address);
    await farm.addPool(20, lusdLP.address, true);
    await farm.addPool(80, ethLP.address, true);
  });

  describe("Farm attributes on deployment", async () => {
    it("Sets correct lusd lp address", async () => {
      const started = await farm.poolInfo(0);
      assert.equal(started.lpToken, lusdLP.address);
    });
    it("Sets correct stringtoken address", async () => {
      const started = await farm.stringToken();
      assert.equal(started, stringToken.address);
    });
    it("Sets correct ethlpToken address", async () => {
      const started = await farm.poolInfo(1);
      assert.equal(started.lpToken, ethLP.address);
    });
    it("Sets correct rewardperblock", async () => {
      const reward = await farm.stringPerBlock();
      assert.equal(reward.toString(), tokens("0.641025641"));
    });
  });

  describe("Farm actions", async () => {
    it("deposit in pool 2", async () => {
      let owner = accounts[0];
      await ethLP.connect(owner).approve(farm.address, tokens("100"));
      await farm.connect(owner).deposit(1, tokens("10"));
      const userBalance = (await ethLP.balanceOf(owner.address)).toString();
      const farmBalance = (await ethLP.balanceOf(farm.address)).toString();
      const userAccount = await farm.userInfo(1, owner.address);

      assert.equal(userAccount["amount"], tokens("10"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(farmBalance, tokens("10"));
    });

    it("deposit in pool 1", async () => {
      let owner = accounts[0];
      await lusdLP.connect(owner).approve(farm.address, tokens("100"));
      await farm.connect(owner).deposit(0, tokens("10"));
      const userBalance = (await lusdLP.balanceOf(owner.address)).toString();
      const farmBalance = (await lusdLP.balanceOf(farm.address)).toString();
      const userAccount = await farm.userInfo(0, owner.address);

      assert.equal(userAccount["amount"], tokens("10"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(farmBalance, tokens("10"));
    });

    const withdrawCheckROI = async (pool, owner) => {
      await farm.connect(owner).withdraw(pool, tokens("10"));
      const userBalance = (await ethLP.balanceOf(owner.address)).toString();
      const farmBalance = (await ethLP.balanceOf(farm.address)).toString();
      const rewards = await stringToken.balanceOf(owner.address);
      const stringPerBlock = await farm.stringPerBlock();
      const newBlocks = 11;
      let den, num;
      if (pool > 0) {
        den = 10;
        num = 8;
      } else {
        num = 2;
        den = 10;
      }
      const expectedRewards = stringPerBlock
        .mul(5)
        .mul(newBlocks)
        .mul(num)
        .div(den);

      assert.equal(rewards.toString(), expectedRewards.toString());
      assert.equal(userBalance, tokens("1000"));
      assert.equal(farmBalance, tokens("0"));
    };

    const claimCheckROI = async (pool, owner) => {
      await farm.connect(owner).claim(pool);
      const token = pool === 0 ? lusdLP : ethLP;
      const userBalance = (await token.balanceOf(owner.address)).toString();
      const farmBalance = (await token.balanceOf(farm.address)).toString();
      const rewards = await stringToken.balanceOf(owner.address);
      const stringPerBlock = await farm.stringPerBlock();
      const newBlocks = 11;
      let den, num;
      if (pool > 0) {
        den = 10;
        num = 8;
      } else {
        num = 2;
        den = 10;
      }
      const expectedRewards = stringPerBlock
        .mul(5)
        .mul(newBlocks)
        .mul(num)
        .div(den);

      assert.equal(rewards.toString(), expectedRewards.toString());
      assert.equal(userBalance, tokens("990"));
      assert.equal(farmBalance, tokens("10"));
    };

    it("withdraw full from pool1", async () => {
      let owner = accounts[0];
      await ethLP.connect(owner).approve(farm.address, tokens("100"));
      await farm.connect(owner).deposit(1, tokens("10"));
      //    goes 1 extra
      await advanceBlock(10);
      await withdrawCheckROI(1, owner);
    });

    it("withdraw full from pool2", async () => {
      let owner = accounts[0];
      await lusdLP.connect(owner).approve(farm.address, tokens("100"));
      await farm.connect(owner).deposit(0, tokens("10"));
      //    goes 1 extra
      await advanceBlock(10);
      await withdrawCheckROI(0, owner);
    });

    it("claim from pool1", async () => {
      let owner = accounts[0];
      await ethLP.connect(owner).approve(farm.address, tokens("100"));
      await farm.connect(owner).deposit(1, tokens("10"));
      //    goes 1 extra
      await advanceBlock(10);
      await claimCheckROI(1, owner);
    });

    it("claim from pool2", async () => {
      let owner = accounts[0];
      await lusdLP.connect(owner).approve(farm.address, tokens("100"));
      await farm.connect(owner).deposit(0, tokens("10"));
      //    goes 1 extra
      await advanceBlock(10);
      await claimCheckROI(0, owner);
    });

    const handleDeposit = async (pool, owner, owner2) => {
      await ethLP.connect(owner).approve(farm.address, tokens("100"));
      await ethLP.connect(owner2).approve(farm.address, tokens("100"));
      await farm.connect(owner).deposit(pool, tokens("10"));
      await farm.connect(owner2).deposit(pool, tokens("50"));
    };

    it("2 users deposit in pool 1", async () => {
      const owner = accounts[0];
      const owner2 = accounts[1];
      await handleDeposit(1, owner, owner2);
      const userBalance = (await ethLP.balanceOf(owner.address)).toString();
      const userBalance2 = (await ethLP.balanceOf(owner2.address)).toString();
      const farmBalance = (await ethLP.balanceOf(farm.address)).toString();
      const userAccount = await farm.userInfo(1, owner.address);
      const userAccount2 = await farm.userInfo(1, owner2.address);

      assert.equal(userAccount.amount.toString(), tokens("10"));
      assert.equal(userAccount2.amount.toString(), tokens("50"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(userBalance2, tokens("950"));
      assert.equal(farmBalance, tokens("60"));
    });

    it("2 users deposit in pool 1 then 1 withdraws half", async () => {
      let owner = accounts[0];
      let owner2 = accounts[1];
      await handleDeposit(1, owner, owner2);

      let userBalance = (await ethLP.balanceOf(owner.address)).toString();
      let userBalance3 = (await ethLP.balanceOf(owner2.address)).toString();
      let farmBalance = (await ethLP.balanceOf(farm.address)).toString();
      let userAccount = await farm.userInfo(1, owner.address);
      let userAccount3 = await farm.userInfo(1, owner2.address);

      assert.equal(userAccount.amount, tokens("10"));
      assert.equal(userAccount3.amount, tokens("50"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(userBalance3, tokens("950"));
      assert.equal(farmBalance, tokens("60"));

      await farm.connect(owner2).withdraw(1, tokens("25"));

      userBalance = (await ethLP.balanceOf(owner.address)).toString();
      userBalance3 = (await ethLP.balanceOf(owner2.address)).toString();
      farmBalance = (await ethLP.balanceOf(farm.address)).toString();
      userAccount = await farm.userInfo(1, owner.address);
      userAccount3 = await farm.userInfo(1, owner2.address);

      assert.equal(userAccount.amount, tokens("10"));
      assert.equal(userAccount3.amount, tokens("25"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(userBalance3, tokens("975"));
      assert.equal(farmBalance, tokens("35"));
    });

    it("2 users deposit in pool 1 then 1 withdraws", async () => {
      let owner = accounts[0];
      let owner2 = accounts[1];
      await handleDeposit(1, owner, owner2);
      let userBalance = (await ethLP.balanceOf(owner.address)).toString();
      let userBalance3 = (await ethLP.balanceOf(owner2.address)).toString();
      let farmBalance = (await ethLP.balanceOf(farm.address)).toString();
      let userAccount = await farm.userInfo(1, owner.address);
      let userAccount3 = await farm.userInfo(1, owner2.address);

      assert.equal(userAccount.amount, tokens("10"));
      assert.equal(userAccount3.amount, tokens("50"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(userBalance3, tokens("950"));
      assert.equal(farmBalance, tokens("60"));

      await farm.connect(owner2).withdraw(1, tokens("50"));

      userBalance = (await ethLP.balanceOf(owner.address)).toString();
      userBalance3 = (await ethLP.balanceOf(owner2.address)).toString();
      farmBalance = (await ethLP.balanceOf(farm.address)).toString();
      userAccount = await farm.userInfo(1, owner.address);
      userAccount3 = await farm.userInfo(1, owner2.address);

      assert.equal(userAccount.amount, tokens("10"));
      assert.equal(userAccount3.amount, tokens("0"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(userBalance3, tokens("1000"));
      assert.equal(farmBalance, tokens("10"));
    });

    it("2 users deposit in pool 1 then both withdraws half", async () => {
      let owner = accounts[0];
      let owner2 = accounts[1];
      await handleDeposit(1, owner, owner2);
      let userBalance = (await ethLP.balanceOf(owner.address)).toString();
      let userBalance3 = (await ethLP.balanceOf(owner2.address)).toString();
      let farmBalance = (await ethLP.balanceOf(farm.address)).toString();
      let userAccount = await farm.userInfo(1, owner.address);
      let userAccount3 = await farm.userInfo(1, owner2.address);

      assert.equal(userAccount.amount, tokens("10"));
      assert.equal(userAccount3.amount.toString(), tokens("50"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(userBalance3, tokens("950"));
      assert.equal(farmBalance, tokens("60"));

      await farm.connect(owner2).withdraw(1, tokens("25"));
      await farm.connect(owner).withdraw(1, tokens("5"));

      userBalance = (await ethLP.balanceOf(owner.address)).toString();
      userBalance3 = (await ethLP.balanceOf(owner2.address)).toString();
      farmBalance = (await ethLP.balanceOf(farm.address)).toString();
      userAccount = await farm.userInfo(1, owner.address);
      userAccount3 = await farm.userInfo(1, owner2.address);

      assert.equal(userAccount.amount.toString(), tokens("5"));
      assert.equal(userAccount3.amount, tokens("25"));
      assert.equal(userBalance, tokens("995"));
      assert.equal(userBalance3, tokens("975"));
      assert.equal(farmBalance, tokens("30"));
    });

    it("2 users deposit in pool 1 then both withdraw ", async () => {
      let owner = accounts[0];
      let owner2 = accounts[1];
      await handleDeposit(1, owner, owner2);
      let userBalance = (await ethLP.balanceOf(owner.address)).toString();
      let userBalance3 = (await ethLP.balanceOf(owner2.address)).toString();
      let farmBalance = (await ethLP.balanceOf(farm.address)).toString();
      let userAccount = await farm.userInfo(1, owner.address);
      let userAccount3 = await farm.userInfo(1, owner2.address);

      assert.equal(userAccount.amount, tokens("10"));
      assert.equal(userAccount3.amount, tokens("50"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(userBalance3, tokens("950"));
      assert.equal(farmBalance, tokens("60"));

      await farm.connect(owner).withdraw(1, tokens("10"));
      await farm.connect(owner2).withdraw(1, tokens("50"));

      userBalance = (await ethLP.balanceOf(owner.address)).toString();
      userBalance3 = (await ethLP.balanceOf(owner2.address)).toString();
      farmBalance = (await ethLP.balanceOf(farm.address)).toString();
      userAccount = await farm.userInfo(1, owner.address);
      userAccount3 = await farm.userInfo(1, owner2.address);

      assert.equal(userAccount.amount, tokens("0"));
      assert.equal(userAccount3.amount, tokens("0"));
      assert.equal(userBalance, tokens("1000"));
      assert.equal(userBalance3, tokens("1000"));
      assert.equal(farmBalance, tokens("0"));
    });

    it("2 users deposit in pool 1 overwithdraws ", async () => {
      let owner = accounts[0];
      let owner2 = accounts[1];
      await handleDeposit(1, owner, owner2);
      let userBalance = (await ethLP.balanceOf(owner.address)).toString();
      let userBalance3 = (await ethLP.balanceOf(owner2.address)).toString();
      let farmBalance = (await ethLP.balanceOf(farm.address)).toString();
      let userAccount = await farm.userInfo(1, owner.address);
      let userAccount3 = await farm.userInfo(1, owner2.address);

      assert.equal(userAccount.amount, tokens("10"));
      assert.equal(userAccount3.amount, tokens("50"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(userBalance3, tokens("950"));
      assert.equal(farmBalance, tokens("60"));

      try {
        await farm.connect(owner).withdraw(1, tokens("50"));
      } catch (err) {
        assert(
          err.message.indexOf("revert") >= 0,
          "error message must contain revert"
        );
      }
    });

    it("rewards for 2 depositers", async () => {
      let owner = accounts[0];
      let owner2 = accounts[1];
      //    causes 1 full block reward to go to first depositer
      await handleDeposit(1, owner, owner2);
      const beforeUserAcc = await farm.userInfo(1, owner.address);
      const beforeUserAcc2 = await farm.userInfo(1, owner2.address);
      //   11 blocks
      const stringPerBlock = await farm.stringPerBlock();
      await advanceBlock(10);
      let totalRewards = await stringToken.balanceOf(farm.address);
      //    12 blocks
      await farm.connect(owner).withdraw(1, tokens("10"));
      totalRewards = await stringToken.balanceOf(farm.address);
      //    13 blocks
      await farm.connect(owner2).withdraw(1, tokens("50"));
      totalRewards = await stringToken.balanceOf(farm.address);
      const rewards = await stringToken.balanceOf(owner.address);
      const rewards2 = await stringToken.balanceOf(owner2.address);
      const newBlocks = 13;
      const num = new BigNumber(stringPerBlock.toString());
      const temp = new BigNumber(stringPerBlock.toString());
      console.log(`String Per Block:${stringPerBlock.toString()}`);
      const expectedRewards = num.times(newBlocks).times(5).times("0.8");

      const owner1Balance = num
        .times(11)
        .times(5)
        .times(0.8)
        .times(1 / 6)
        .plus(temp.times(5).times(0.8));
      const owner2Balance = num
        .times(11)
        .times(5)
        .times(0.8)
        .times(5 / 6)
        .plus(temp.times(5).times(0.8));
      console.log(`total rewards expected:${expectedRewards.toString()}`);
      console.log(`total rewards actual:${totalRewards.toString()}`);
      console.log(`owner share of rewards: ${owner1Balance.toString()}`);
      console.log(`owner2 share of rewards: ${owner2Balance.toString()}`);
      console.log(`actual rewards: ${rewards.toString()}`);
      console.log(`actual rewards2: ${rewards2.toString()}`);
      assert.equal(
        truncateString(rewards.toString()),
        truncateString(owner1Balance.toString())
      );
      assert.equal(
        truncateString(rewards2.toString()),
        truncateString(owner2Balance.toString())
      );
    });

    it("Check Boosted logic", async () => {
      let owner = accounts[0];
      let owner2 = accounts[1];
      await handleDeposit(1, owner, owner2);

      await advanceBlock(200);
      await farm.connect(owner).withdraw(1, tokens("10"));

      let isBoosted = await farm.isBoosted();
      assert.equal(isBoosted, false);
    });
  });
});
