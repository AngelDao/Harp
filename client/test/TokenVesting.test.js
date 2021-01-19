const { assert } = require("chai");
const timeMachine = require("ganache-time-traveler");

const OZStringToken = artifacts.require("StringToken");
const TokenVesting = artifacts.require("TokenVesting");

const SECOND = 1000;
const HOUR = 60 * 60;
const DAY = 24 * HOUR;

require("chai").use(require("chai-as-promised")).should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

const truncateString = (str) => {
  return str.substr(0, 4);
};

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
      console.log(actualRate.toString());
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
      //3 days
      // First distribution
      await timeMachine.advanceTimeAndBlock(72 * HOUR);
      await tokenVesting.releasePending();

      let expectedRate = Math.floor(1000000 / yearsToLockUp);
      console.log(`yearToLockUp:${yearsToLockUp}`);
      console.log(`expectedRate:${expectedRate}`);
      let expectedBalance = expectedRate * 3;
      console.log(`expectedBalance:${expectedBalance}`);
      let balance = await ozStringToken.balanceOf(accounts[2]);
      let lastBalance = balance;

      console.log(`actualBalance:${balance}`);
      console.log(
        "assert balance transfered to be correct, and to right wallet"
      );
      assert.equal(tokens(expectedBalance.toString()), balance.toString());
      let totalSupply = (await ozStringToken.totalSupply()).toString();

      console.log("assert amount was minted and added to totalsupply ");
      const firstSupplyCheck = new web3.utils.BN(2000000);
      let currentSupply = firstSupplyCheck.add(balance);
      assert.equal(totalSupply, currentBalance.toString());
      let allowcationLeft = (
        await tokenVesting.AngelDAOAllocationLeft()
      ).toString();
      console.log("assert remaining allocation updated ");
      const firstAlloCheck = new web3.utils.BN(1000000);
      let currentLeft = firstAlloCheck.sub(balance);
      assert.equal(allowcationLeft, currentLeft.toString());
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
      balance = await ozStringToken.balanceOf(accounts[2]);
      console.log(`actualBalance:${balance}`);
      console.log(
        "assert balance transfered to be correct, and to right wallet"
      );
      assert.equal(tokens(expectedBalance.toString()), balance.toString());
      totalSupply = (await ozStringToken.totalSupply()).toString();
      console.log("assert amount was minted and added to totalsupply ");
      currentSupply = firstSupplyCheck.add(balance);
      assert.equal(totalSupply, currentLeft.toString());
      allowcationLeft = await tokenVesting.AngelDAOAllocationLeft().toString();
      console.log("assert remaining allocation updated ");
      currentLeft = firstAlloCheck.sub(balance);
      assert.equal(allowcationLeft, currentLeft.toString());
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
      assert.equal(tokens(expectedBalance.toString()), balance.toString());
      totalSupply = (await ozStringToken.totalSupply()).toString();
      console.log("assert amount was minted and added to totalsupply ");
      currentSupply = firstSupplyCheck.add(balance);
      assert.equal(totalSupply, currentSupply.toString());
      allowcationLeft = await tokenVesting.AngelDAOAllocationLeft().toString();
      console.log("assert remaining allocation updated ");
      currentLeft = firstAlloCheck.sub(balance);
      assert.equal(allowcationLeft, currentLeft.toString());
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
      assert.equal(tokens(expectedBalance.toString()), balance.toString());
      totalSupply = (await ozStringToken.totalSupply()).toString();
      console.log("assert amount was minted and added to totalsupply ");
      currentSupply = firstSupplyCheck.add(balance);
      assert.equal(totalSupply, currentSupply.toString());
      allowcationLeft = await tokenVesting.AngelDAOAllocationLeft().toString();
      console.log("assert remaining allocation updated ");
      console.log(allowcationLeft);
      currentLeft = firstAlloCheck.sub(balance);
      assert.equal(allowcationLeft, currentLeft.toString());
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
