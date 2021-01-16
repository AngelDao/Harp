const { assert } = require("chai");
const timeMachine = require("ganache-time-traveler");

const OZStringToken = artifacts.require("StringToken");
const TokenVesting = artifacts.require("TokenVesting");

const SECOND = 1000;
const HOUR = 60 * 60;
const DAY = 24 * HOUR;

require("chai").use(require("chai-as-promised")).should();

contract("TokenVesting Tests", (accounts) => {
  let ozStringToken, tokenVesting, yearsToLockUp, clock;
  beforeEach(async () => {
    let snapshot = await timeMachine.takeSnapshot();
    snapshotId = snapshot["result"];
  });

  afterEach(async () => {
    await timeMachine.revertToSnapshot(snapshotId);
  });

  before(async () => {
    const AngelDAOAddress = accounts[2];
    const HarpDAOAddress = accounts[1];
    const owner = accounts[3];
    ozStringToken = await OZStringToken.new(
      "ozString",
      "ozSTRING",
      HarpDAOAddress,
      owner
    );

    yearsToLockUp = 365 * 2;
    tokenVesting = await TokenVesting.new(
      AngelDAOAddress,
      yearsToLockUp,
      ozStringToken.address
    );
    const vestingAddress = tokenVesting.address;

    await ozStringToken.addVestingAddress(vestingAddress, { from: owner });
  });

  describe("Vesting Contract attributes on deployment", async () => {
    it("Sets correct address for the AngeDAO", async () => {
      const AngelDAOAddr = await tokenVesting.AngelDAOAddress();
      assert.equal(AngelDAOAddr, accounts[2]);
    });
    it("Sets correct max allocation size for AngelDAO", async () => {
      const AngelDAOAllo = await tokenVesting.AngelDAOAllocation();
      assert.equal(AngelDAOAllo, 1000000);
    });
    it("Sets correct allocation left size", async () => {
      const AngelDAOAlloLeft = await tokenVesting.AngelDAOAllocationLeft();
      assert.equal(AngelDAOAlloLeft, 1000000);
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
      const expectedRate = Math.floor(1000000 / yearsToLockUp);
      const actualRate = await tokenVesting.dailyVestingRate();
      assert.equal(actualRate, expectedRate);
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
      //3 days
      // First distribution
      await timeMachine.advanceTimeAndBlock(72 * HOUR);
      await tokenVesting.releasePending();
      let expectedRate = Math.floor(1000000 / yearsToLockUp);
      console.log(`yearToLockUp:${yearsToLockUp}`);
      console.log(`expectedRate:${expectedRate}`);
      let expectedBalance = expectedRate * 3;
      console.log(`expectedBalance:${expectedBalance}`);
      let balance = (await ozStringToken.balanceOf(accounts[2])).toNumber();
      let lastBalance = balance;
      console.log(`actualBalance:${balance}`);
      console.log(
        "assert balance transfered to be correct, and to right wallet"
      );
      assert.equal(expectedBalance, balance);
      let totalSupply = (await ozStringToken.totalSupply()).toNumber();
      console.log("assert amount was minted and added to totalsupply ");
      assert.equal(totalSupply, 2000000 + balance);
      let allowcationLeft = (
        await tokenVesting.AngelDAOAllocationLeft()
      ).toNumber();
      console.log("assert remaining allocation updated ");
      assert.equal(allowcationLeft, 1000000 - balance);
      let lastDistributionTime = (
        await tokenVesting.lastDistributionTime()
      ).toNumber();
      let startDistributionTime = (
        await tokenVesting.startDistributionTime()
      ).toNumber();
      console.log("assert lastDistributionTime updated by 3 days(in seconds) ");
      assert.equal(lastDistributionTime - startDistributionTime, 3 * DAY);

      // 5 Days
      // Second distribution
      await timeMachine.advanceTimeAndBlock(5 * DAY);
      await tokenVesting.releasePending();
      expectedRate = Math.floor(1000000 / yearsToLockUp);
      console.log(`yearToLockUp:${yearsToLockUp}`);
      console.log(`expectedRate:${expectedRate}`);
      expectedBalance = expectedRate * 5 + lastBalance;
      console.log(`expectedBalance:${expectedBalance}`);
      balance = (await ozStringToken.balanceOf(accounts[2])).toNumber();
      console.log(`actualBalance:${balance}`);
      console.log(
        "assert balance transfered to be correct, and to right wallet"
      );
      assert.equal(expectedBalance, balance);
      totalSupply = (await ozStringToken.totalSupply()).toNumber();
      console.log("assert amount was minted and added to totalsupply ");
      assert.equal(totalSupply, 2000000 + balance);
      allowcationLeft = (
        await tokenVesting.AngelDAOAllocationLeft()
      ).toNumber();
      console.log("assert remaining allocation updated ");
      assert.equal(allowcationLeft, 1000000 - balance);
      lastDistributionTime = (
        await tokenVesting.lastDistributionTime()
      ).toNumber();
      startDistributionTime = (
        await tokenVesting.startDistributionTime()
      ).toNumber();
      console.log("assert lastDistributionTime updated by 5 days(in seconds) ");
      assert.equal(lastDistributionTime - startDistributionTime, 8 * DAY);
      lastBalance = expectedBalance;

      // 81.5 Days
      // Third distribution
      await timeMachine.advanceTimeAndBlock(81 * DAY + DAY * 0.5);
      await tokenVesting.releasePending();
      expectedRate = Math.floor(1000000 / yearsToLockUp);
      console.log(`yearToLockUp:${yearsToLockUp}`);
      console.log(`expectedRate:${expectedRate}`);
      expectedBalance = expectedRate * 81 + lastBalance;
      console.log(`expectedBalance:${expectedBalance}`);
      balance = (await ozStringToken.balanceOf(accounts[2])).toNumber();
      console.log(`actualBalance:${balance}`);
      console.log(
        "assert balance transfered to be correct, and to right wallet"
      );
      assert.equal(expectedBalance, balance);
      totalSupply = (await ozStringToken.totalSupply()).toNumber();
      console.log("assert amount was minted and added to totalsupply ");
      assert.equal(totalSupply, 2000000 + balance);
      allowcationLeft = (
        await tokenVesting.AngelDAOAllocationLeft()
      ).toNumber();
      console.log("assert remaining allocation updated ");
      assert.equal(allowcationLeft, 1000000 - balance);
      lastDistributionTime = (
        await tokenVesting.lastDistributionTime()
      ).toNumber();
      startDistributionTime = (
        await tokenVesting.startDistributionTime()
      ).toNumber();
      console.log(
        "assert lastDistributionTime updated by 81 days(in seconds) "
      );
      assert.equal(lastDistributionTime - startDistributionTime, 89 * DAY);
      lastBalance = expectedBalance;

      // 900.5 Days
      // Third distribution
      await timeMachine.advanceTimeAndBlock(900 * DAY + DAY * 0.5);
      await tokenVesting.releasePending();
      expectedRate = Math.floor(1000000 / yearsToLockUp);
      console.log(`yearToLockUp:${yearsToLockUp}`);
      console.log(`expectedRate:${expectedRate}`);
      expectedBalance = 1000000;
      console.log(`expectedBalance:${expectedBalance}`);
      balance = (await ozStringToken.balanceOf(accounts[2])).toNumber();
      console.log(`actualBalance:${balance}`);
      console.log(
        "assert balance transfered to be correct, and to right wallet"
      );
      assert.equal(expectedBalance, balance);
      totalSupply = (await ozStringToken.totalSupply()).toNumber();
      console.log("assert amount was minted and added to totalsupply ");
      assert.equal(totalSupply, 2000000 + balance);
      allowcationLeft = (
        await tokenVesting.AngelDAOAllocationLeft()
      ).toNumber();
      console.log("assert remaining allocation updated ");
      console.log(allowcationLeft);
      assert.equal(allowcationLeft, 1000000 - balance);
      lastDistributionTime = (
        await tokenVesting.lastDistributionTime()
      ).toNumber();
      startDistributionTime = (
        await tokenVesting.startDistributionTime()
      ).toNumber();
      console.log(
        "assert lastDistributionTime updated by 81 days(in seconds) "
      );
      assert.equal(lastDistributionTime - startDistributionTime, 990 * DAY);
      lastBalance = expectedBalance;
      const vestingComplete = await tokenVesting.vestingComplete();
      console.log("assert vestingComplete is true");
      assert.equal(vestingComplete, true);

      //   make sure releasePending() can no longer be called
      console.log("assert releasePending returns err");
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
