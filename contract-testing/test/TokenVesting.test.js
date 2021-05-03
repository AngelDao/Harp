/* eslint-disable jest/valid-describe */
/* eslint-disable no-undef */
const { assert, expect } = require("chai");
const deploymentHelperLiquity = require("../utils/deploymentHelperLiquity");
const deploymentHelperHarp = require("../utils/deploymentHelperHarp");
const { ethers } = require("hardhat");
const testHelpers = require("../utils/testHelpers.js");
require("chai").use(require("chai-as-promised")).should();
const StabilityPool = artifacts.require("./StabilityPool.sol");
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

contract("STRING Token Tests", () => {
  let contracts, accounts, harpContracts, stringToken, tokenVesting;

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
    await stringToken.addMinter(accounts[0].address);
    await stringToken.addMinter(tokenVesting.address);
    await stringToken.revokeOwnership();
  });

  describe("Vesting Contract attributes on deployment", async () => {
    it("Sets correct address for the AngeDAO", async () => {
      const AngelDAOAddr = await tokenVesting.AngelDAOAddress();
      assert.equal(AngelDAOAddr, AngelDAO);
    });
    it("Sets correct max allocation size for AngelDAO", async () => {
      const AngelDAOAllo = (await tokenVesting.AngelDAOAllocation()).toString();
      assert.equal(AngelDAOAllo, tokens("1000000"));
    });
    it("Sets correct allocation left size", async () => {
      const AngelDAOAlloLeft = (
        await tokenVesting.AngelDAOAllocationLeft()
      ).toString();
      assert.equal(AngelDAOAlloLeft, tokens("1000000"));
    });
    it("Sets vesting complete to false", async () => {
      const complete = await tokenVesting.vestingComplete();
      assert.equal(complete, false);
    });
    it("Sets vesting start to false", async () => {
      const started = await tokenVesting.vestingStarted();
      assert.equal(started, false);
    });
    it("Sets daily vesting rate correctly", async () => {
      const vestingMax = new web3.utils.BN(1000000);
      const divisor = new web3.utils.BN(yearsToLockUp);
      const expectedRate = vestingMax.div(divisor);
      const actualRate = (await tokenVesting.dailyVestingRate()).toString();
      assert.equal(
        truncateString(actualRate.toString()),
        expectedRate.toString()
      );
    });
    it("Sets vesting period correctly", async () => {
      const days = await tokenVesting.vestingPeriodDays();
      assert.equal(days, yearsToLockUp);
    });
    it("Sets vesting period correctly", async () => {
      const days = await tokenVesting.vestingPeriodDays();
      assert.equal(days, yearsToLockUp);
    });
  });

  describe("Token Vesting actions", async () => {
    it("Starts Token Vesting", async () => {
      let started = await tokenVesting.vestingStarted();
      assert.equal(started, false);
      await tokenVesting.start();
      started = await tokenVesting.vestingStarted();
      assert.equal(started, true);
      try {
        await tokenVesting.start();
      } catch (err) {
        assert(
          err.message.indexOf("revert") >= 0,
          "Vesting has already started"
        );
      }
      //    3 days
      //    First distribution
      await th.fastForwardTime(72 * HOUR, web3.currentProvider);

      await tokenVesting.releasePending();

      const vestingMax = new web3.utils.BN(1000000);
      const divisor = new web3.utils.BN(yearsToLockUp);
      const expectedRate = vestingMax.div(divisor);
      let expectedBalance = expectedRate * 3;
      let balance = new web3.utils.BN(
        (await stringToken.balanceOf(AngelDAO)).toString()
      );
      let lastBalance = balance;

      assert.equal(tokens(expectedBalance.toString()), balance.toString());
      let totalSupply = (await stringToken.totalSupply()).toString();
      const firstSupplyCheck = new web3.utils.BN(tokens("2000000"));
      let currentSupply = firstSupplyCheck.add(balance);
      assert.equal(totalSupply, currentSupply.toString());
      let allowcationLeft = (
        await tokenVesting.AngelDAOAllocationLeft()
      ).toString();
      const firstAlloCheck = new web3.utils.BN(tokens("1000000"));
      let currentLeft = firstAlloCheck.sub(balance);
      assert.equal(allowcationLeft, currentLeft.toString());
      let lastDistributionTime = (
        await tokenVesting.lastDistributionTime()
      ).toNumber();
      let startDistributionTime = (
        await tokenVesting.startDistributionTime()
      ).toNumber();
      assert.equal(lastDistributionTime - startDistributionTime, 3 * DAY);

      //    5 Days
      //    Second distribution
      await th.fastForwardTime(5 * DAY, web3.currentProvider);
      await tokenVesting.releasePending();
      expectedBalance = expectedRate * 5 + lastBalance;
      balance = await new web3.utils.BN(
        (await stringToken.balanceOf(AngelDAO)).toString()
      );
      assert.equal(tokens(expectedBalance.toString()), balance.toString());
      totalSupply = (await stringToken.totalSupply()).toString();
      currentSupply = firstSupplyCheck.add(balance);
      assert.equal(totalSupply, currentSupply.toString());
      allowcationLeft = (
        await tokenVesting.AngelDAOAllocationLeft()
      ).toString();
      currentLeft = firstAlloCheck.sub(balance);
      assert.equal(allowcationLeft, currentLeft.toString());
      lastDistributionTime = (
        await tokenVesting.lastDistributionTime()
      ).toNumber();
      startDistributionTime = (
        await tokenVesting.startDistributionTime()
      ).toNumber();
      assert.equal(lastDistributionTime - startDistributionTime, 8 * DAY);
      lastBalance = expectedBalance;

      //    81.5 Days
      //    Third distribution
      await th.fastForwardTime(81 * DAY + DAY * 0.5, web3.currentProvider);
      await tokenVesting.releasePending();
      expectedBalance = expectedRate * 81 + lastBalance;
      balance = await new web3.utils.BN(
        (await stringToken.balanceOf(AngelDAO)).toString()
      );
      assert.equal(tokens(expectedBalance.toString()), balance.toString());
      totalSupply = (await stringToken.totalSupply()).toString();
      currentSupply = firstSupplyCheck.add(balance);
      assert.equal(totalSupply, currentSupply.toString());
      allowcationLeft = (
        await tokenVesting.AngelDAOAllocationLeft()
      ).toString();
      currentLeft = firstAlloCheck.sub(balance);
      assert.equal(allowcationLeft, currentLeft.toString());
      lastDistributionTime = (
        await tokenVesting.lastDistributionTime()
      ).toNumber();
      startDistributionTime = (
        await tokenVesting.startDistributionTime()
      ).toNumber();
      assert.equal(lastDistributionTime - startDistributionTime, 89 * DAY);
      lastBalance = expectedBalance;

      //    900.5 Days
      //    Third distribution
      await th.fastForwardTime(900 * DAY + DAY * 0.5, web3.currentProvider);
      await tokenVesting.releasePending();
      expectedBalance = 1000000;
      balance = await new web3.utils.BN(
        (await stringToken.balanceOf(AngelDAO)).toString()
      );
      assert.equal(tokens(expectedBalance.toString()), balance.toString());
      totalSupply = (await stringToken.totalSupply()).toString();
      currentSupply = firstSupplyCheck.add(balance);
      assert.equal(totalSupply, currentSupply.toString());
      allowcationLeft = (
        await tokenVesting.AngelDAOAllocationLeft()
      ).toString();
      currentLeft = firstAlloCheck.sub(balance);
      assert.equal(allowcationLeft, currentLeft.toString());
      lastDistributionTime = (
        await tokenVesting.lastDistributionTime()
      ).toNumber();
      startDistributionTime = (
        await tokenVesting.startDistributionTime()
      ).toNumber();
      assert.equal(lastDistributionTime - startDistributionTime, 990 * DAY);
      lastBalance = expectedBalance;
      const vestingComplete = await tokenVesting.vestingComplete();
      assert.equal(vestingComplete, true);

      //  make sure releasePending() can no longer be called
      try {
        await tokenVesting.releasePending();
      } catch (err) {
        assert(
          err.message.indexOf("revert") >= 0,
          "Vesting is complete no more tokens to be minted"
        );
      }
    });
  });
});
