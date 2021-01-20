const { assert } = require("chai");
const timeMachine = require("ganache-time-traveler");

const StringToken = artifacts.require("StringToken");
const LUSDLP = artifacts.require("LUSDLPToken");
const ETHLP = artifacts.require("ETHLPToken");
const LatestFarm = artifacts.require("LatestFarm");

const SECOND = 1000;
const HOUR = 60 * 60;
const DAY = 24 * HOUR;

require("chai").use(require("chai-as-promised")).should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

const truncateString = (str) => {
  return str.substr(0, 8);
};

function readableTokens(n) {
  return web3.utils.toWei(n, "wei");
}

const advanceBlock = async (n) => {
  for (let i = 0; i < n; i++) {
    await timeMachine.advanceBlock();
  }
};

const makeBN = (n) => {
  return new web3.utils.BN(n);
};

contract("Farm Tests", async (accounts) => {
  let stringToken, farm, ethLPToken, lusdLPToken, clock;
  beforeEach(async () => {
    let snapshot = await timeMachine.takeSnapshot();
    snapshotId = snapshot["result"];
  });

  afterEach(async () => {
    await timeMachine.revertToSnapshot(snapshotId);
  });

  before(async () => {
    const HarpDAOAddress = accounts[2];
    const owner = accounts[1];
    const owner2 = accounts[5];
    const ownerToken = accounts[3];

    stringToken = await StringToken.new(
      "ozString",
      "ozSTRING",
      HarpDAOAddress,
      ownerToken
    );
    ethLPToken = await ETHLP.new(owner, owner2);
    lusdLPToken = await LUSDLP.new(owner, owner2);

    farm = await LatestFarm.new(stringToken.address);

    await farm.add(20, lusdLPToken.address, true);
    await farm.add(80, ethLPToken.address, true);
    await stringToken.addVestingAddress(farm.address, { from: ownerToken });
  });

  describe("Farm attributes on deployment", async () => {
    it("Sets correct lusd lp address", async () => {
      const started = await farm.poolInfo(0);
      assert.equal(started.lpToken, lusdLPToken.address);
    });
    it("Sets correct stringtoken address", async () => {
      const started = await farm.stringToken();
      assert.equal(started, stringToken.address);
    });
    it("Sets correct ethlpToken address", async () => {
      const started = await farm.poolInfo(1);
      assert.equal(started.lpToken, ethLPToken.address);
    });
    it("Sets correct rewardperblock", async () => {
      const reward = await farm.stringPerBlock();
      assert.equal(reward, tokens("1.435897436"));
    });
  });

  describe("Farm actions", async () => {
    it("deposit in pool 2", async () => {
      let owner = accounts[1];
      await ethLPToken.approve(farm.address, tokens("100"), { from: owner });
      await farm.deposit(1, tokens("10"), { from: owner });
      const userBalance = (await ethLPToken.balanceOf(owner)).toString();
      const farmBalance = (await ethLPToken.balanceOf(farm.address)).toString();
      const userAccount = await farm.userInfo(1, owner);

      assert.equal(userAccount["amount"], tokens("10"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(farmBalance, tokens("10"));
    });

    it("deposit in pool 1", async () => {
      let owner = accounts[1];
      await lusdLPToken.approve(farm.address, tokens("100"), { from: owner });
      await farm.deposit(0, tokens("10"), { from: owner });
      const userBalance = (await lusdLPToken.balanceOf(owner)).toString();
      const farmBalance = (
        await lusdLPToken.balanceOf(farm.address)
      ).toString();
      const userAccount = await farm.userInfo(0, owner);

      assert.equal(userAccount["amount"], tokens("10"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(farmBalance, tokens("10"));
    });

    const withdrawCheckROI = async (pool, owner) => {
      console.log(afterBlock.toNumber());
      await farm.withdraw(pool, tokens("10"), { from: owner });
      const userBalance = (await ethLPToken.balanceOf(owner)).toString();
      const farmBalance = (await ethLPToken.balanceOf(farm.address)).toString();
      const rewards = await stringToken.balanceOf(owner);
      const stringPerBlock = await farm.stringPerBlock();
      const newBlocks = 11;
      const newBN = makeBN(newBlocks);
      const five = makeBN(5);
      let den, num;
      if (pool > 0) {
        den = 10;
        num = 8;
      } else {
        num = 2;
        den = 10;
      }
      const poolNumerator = makeBN(num);
      const poolDenominator = makeBN(den);
      const expectedRewards = stringPerBlock
        .mul(five)
        .mul(newBN)
        .mul(poolNumerator)
        .div(poolDenominator);

      //   console.log(expectedRewards.toString());
      console.log(`rewards earned:${rewards.toString()}`);
      assert.equal(rewards.toString(), expectedRewards.toString());
      assert.equal(userBalance, tokens("1000"));
      assert.equal(farmBalance, tokens("0"));
    };

    it("withdraw full from pool1", async () => {
      let owner = accounts[1];
      await ethLPToken.approve(farm.address, tokens("100"), { from: owner });
      await farm.deposit(1, tokens("10"), { from: owner });
      console.log(beforeBlock.toNumber());
      // goes 1 extra
      await advanceBlock(10);
      await withdrawCheckROI(1, owner);
    });

    it("withdraw full from pool2", async () => {
      let owner = accounts[1];
      await lusdLPToken.approve(farm.address, tokens("100"), { from: owner });
      await farm.deposit(0, tokens("10"), { from: owner });
      console.log(beforeBlock.toNumber());
      // goes 1 extra
      await advanceBlock(10);
      await withdrawCheckROI(0, owner);
    });

    const handleDeposit = async (pool, owner, owner3) => {
      await ethLPToken.approve(farm.address, tokens("100"), { from: owner });
      await ethLPToken.approve(farm.address, tokens("100"), { from: owner3 });
      await farm.deposit(pool, tokens("10"), { from: owner });
      await farm.deposit(pool, tokens("50"), { from: owner3 });
    };

    it("2 users deposit in pool 1", async () => {
      let owner = accounts[1];
      let owner3 = accounts[5];
      await handleDeposit(1, owner, owner3);
      const userBalance = (await ethLPToken.balanceOf(owner)).toString();
      const userBalance3 = (await ethLPToken.balanceOf(owner3)).toString();
      const farmBalance = (await ethLPToken.balanceOf(farm.address)).toString();
      const userAccount = await farm.userInfo(1, owner);
      const userAccount3 = await farm.userInfo(1, owner3);

      assert.equal(userAccount.amount.toString(), tokens("10"));
      assert.equal(userAccount3.amount.toString(), tokens("50"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(userBalance3, tokens("950"));
      assert.equal(farmBalance, tokens("60"));
    });

    it("2 users deposit in pool 1 then 1 withdraws half", async () => {
      let owner = accounts[1];
      let owner3 = accounts[5];
      await handleDeposit(1, owner, owner3);

      let userBalance = (await ethLPToken.balanceOf(owner)).toString();
      let userBalance3 = (await ethLPToken.balanceOf(owner3)).toString();
      let farmBalance = (await ethLPToken.balanceOf(farm.address)).toString();
      let userAccount = await farm.userInfo(1, owner);
      let userAccount3 = await farm.userInfo(1, owner3);

      assert.equal(userAccount.amount, tokens("10"));
      assert.equal(userAccount3.amount, tokens("50"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(userBalance3, tokens("950"));
      assert.equal(farmBalance, tokens("60"));

      await farm.withdraw(1, tokens("25"), { from: owner3 });

      userBalance = (await ethLPToken.balanceOf(owner)).toString();
      userBalance3 = (await ethLPToken.balanceOf(owner3)).toString();
      farmBalance = (await ethLPToken.balanceOf(farm.address)).toString();
      userAccount = await farm.userInfo(1, owner);
      userAccount3 = await farm.userInfo(1, owner3);

      assert.equal(userAccount.amount, tokens("10"));
      assert.equal(userAccount3.amount, tokens("25"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(userBalance3, tokens("975"));
      assert.equal(farmBalance, tokens("35"));
    });

    it("2 users deposit in pool 1 then 1 withdraws", async () => {
      let owner = accounts[1];
      let owner3 = accounts[5];
      await handleDeposit(1, owner, owner3);
      let userBalance = (await ethLPToken.balanceOf(owner)).toString();
      let userBalance3 = (await ethLPToken.balanceOf(owner3)).toString();
      let farmBalance = (await ethLPToken.balanceOf(farm.address)).toString();
      let userAccount = await farm.userInfo(1, owner);
      let userAccount3 = await farm.userInfo(1, owner3);

      assert.equal(userAccount.amount, tokens("10"));
      assert.equal(userAccount3.amount, tokens("50"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(userBalance3, tokens("950"));
      assert.equal(farmBalance, tokens("60"));

      await farm.withdraw(1, tokens("50"), { from: owner3 });

      userBalance = (await ethLPToken.balanceOf(owner)).toString();
      userBalance3 = (await ethLPToken.balanceOf(owner3)).toString();
      farmBalance = (await ethLPToken.balanceOf(farm.address)).toString();
      userAccount = await farm.userInfo(1, owner);
      userAccount3 = await farm.userInfo(1, owner3);

      assert.equal(userAccount.amount, tokens("10"));
      assert.equal(userAccount3.amount, tokens("0"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(userBalance3, tokens("1000"));
      assert.equal(farmBalance, tokens("10"));
    });

    it("2 users deposit in pool 1 then both withdraws half", async () => {
      let owner = accounts[1];
      let owner3 = accounts[5];
      await handleDeposit(1, owner, owner3);
      let userBalance = (await ethLPToken.balanceOf(owner)).toString();
      let userBalance3 = (await ethLPToken.balanceOf(owner3)).toString();
      let farmBalance = (await ethLPToken.balanceOf(farm.address)).toString();
      let userAccount = await farm.userInfo(1, owner);
      let userAccount3 = await farm.userInfo(1, owner3);

      assert.equal(userAccount.amount, tokens("10"));
      assert.equal(userAccount3.amount.toString(), tokens("50"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(userBalance3, tokens("950"));
      assert.equal(farmBalance, tokens("60"));

      await farm.withdraw(1, tokens("25"), { from: owner3 });
      await farm.withdraw(1, tokens("5"), { from: owner });

      userBalance = (await ethLPToken.balanceOf(owner)).toString();
      userBalance3 = (await ethLPToken.balanceOf(owner3)).toString();
      farmBalance = (await ethLPToken.balanceOf(farm.address)).toString();
      userAccount = await farm.userInfo(1, owner);
      userAccount3 = await farm.userInfo(1, owner3);

      assert.equal(userAccount.amount.toString(), tokens("5"));
      assert.equal(userAccount3.amount, tokens("25"));
      assert.equal(userBalance, tokens("995"));
      assert.equal(userBalance3, tokens("975"));
      assert.equal(farmBalance, tokens("30"));
    });

    it("2 users deposit in pool 1 then both withdraw ", async () => {
      let owner = accounts[1];
      let owner3 = accounts[5];
      await handleDeposit(1, owner, owner3);
      let userBalance = (await ethLPToken.balanceOf(owner)).toString();
      let userBalance3 = (await ethLPToken.balanceOf(owner3)).toString();
      let farmBalance = (await ethLPToken.balanceOf(farm.address)).toString();
      let userAccount = await farm.userInfo(1, owner);
      let userAccount3 = await farm.userInfo(1, owner3);

      assert.equal(userAccount.amount, tokens("10"));
      assert.equal(userAccount3.amount, tokens("50"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(userBalance3, tokens("950"));
      assert.equal(farmBalance, tokens("60"));

      await farm.withdraw(1, tokens("10"), { from: owner });
      await farm.withdraw(1, tokens("50"), { from: owner3 });

      userBalance = (await ethLPToken.balanceOf(owner)).toString();
      userBalance3 = (await ethLPToken.balanceOf(owner3)).toString();
      farmBalance = (await ethLPToken.balanceOf(farm.address)).toString();
      userAccount = await farm.userInfo(1, owner);
      userAccount3 = await farm.userInfo(1, owner3);

      assert.equal(userAccount.amount, tokens("0"));
      assert.equal(userAccount3.amount, tokens("0"));
      assert.equal(userBalance, tokens("1000"));
      assert.equal(userBalance3, tokens("1000"));
      assert.equal(farmBalance, tokens("0"));
    });

    it("2 users deposit in pool 1 overwithdraws ", async () => {
      let owner = accounts[1];
      let owner3 = accounts[5];
      await handleDeposit(1, owner, owner3);
      let userBalance = (await ethLPToken.balanceOf(owner)).toString();
      let userBalance3 = (await ethLPToken.balanceOf(owner3)).toString();
      let farmBalance = (await ethLPToken.balanceOf(farm.address)).toString();
      let userAccount = await farm.userInfo(1, owner);
      let userAccount3 = await farm.userInfo(1, owner3);

      assert.equal(userAccount.amount, tokens("10"));
      assert.equal(userAccount3.amount, tokens("50"));
      assert.equal(userBalance, tokens("990"));
      assert.equal(userBalance3, tokens("950"));
      assert.equal(farmBalance, tokens("60"));

      try {
        await farm.withdraw(1, tokens("50"), { from: owner });
      } catch (err) {
        assert(
          err.message.indexOf("revert") >= 0,
          "error message must contain revert"
        );
      }
    });

    // needs math checked
    it("rewards for 2 depositers", async () => {
      let owner = accounts[1];
      let owner3 = accounts[5];
      await handleDeposit(1, owner, owner3);
      const beforeUserAcc = await farm.userInfo(1, owner);
      const beforeUserAcc2 = await farm.userInfo(1, owner3);
      // 13 blocks
      await advanceBlock(10);

      const userShare1Numerator = makeBN(1);
      const userShare1Denominator = makeBN(6);
      const userShare2Numerator = makeBN(5);
      const userShare2Denominator = makeBN(6);
      const poolNumerator = makeBN(8);
      const poolDenominator = makeBN(10);
      await farm.withdraw(1, tokens("10"), { from: owner });
      await farm.withdraw(1, tokens("50"), { from: owner3 });
      const rewards = await stringToken.balanceOf(owner);
      const rewards2 = await stringToken.balanceOf(owner3);
      const stringPerBlock = await farm.stringPerBlock();
      const newBlocks = makeBN(13);
      const five = makeBN(5);
      const expectedRewards = stringPerBlock
        .mul(five)
        .mul(newBlocks)
        .mul(poolNumerator)
        .div(poolDenominator);
      const owner1Balance = expectedRewards
        .mul(userShare1Numerator)
        .div(userShare1Denominator);
      const owner2Balance = expectedRewards
        .mul(userShare2Numerator)
        .div(userShare2Denominator);
      console.log(`total rewards expected:${expectedRewards.toString()}`);
      console.log(`owner share of rewards: ${owner1Balance.toString()}`);
      console.log(`owner2 share of rewards: ${owner2Balance.toString()}`);
      console.log(`actual rewards: ${rewards.toString()}`);
      console.log(`actual rewards2: ${rewards2.toString()}`);
      assert.equal(
        truncateString(rewards.toString()),
        truncateString(owner1Balance.toString())
      );
      assert.equal(rewards2.toString(), owner2Balance.toString());
    });

    // check math
    it("rewards for 2 depositers", async () => {
      let owner = accounts[1];
      let owner3 = accounts[5];
      await handleDeposit(1, owner, owner3);
      const beforeUserAcc = await farm.userInfo(1, owner);
      const beforeUserAcc2 = await farm.userInfo(1, owner3);
      // 13 blocks
      await advanceBlock(10);

      const userShare1Numerator = makeBN(1);
      const userShare1Denominator = makeBN(6);
      const userShare2Numerator = makeBN(5);
      const userShare2Denominator = makeBN(6);
      const poolNumerator = makeBN(8);
      const poolDenominator = makeBN(10);
      await farm.withdraw(1, tokens("10"), { from: owner });
      await farm.withdraw(1, tokens("50"), { from: owner3 });
      const rewards = await stringToken.balanceOf(owner);
      const rewards2 = await stringToken.balanceOf(owner3);
      const stringPerBlock = await farm.stringPerBlock();
      const newBlocks = makeBN(13);
      const five = makeBN(5);
      const expectedRewards = stringPerBlock
        .mul(five)
        .mul(newBlocks)
        .mul(poolNumerator)
        .div(poolDenominator);
      const owner1Balance = expectedRewards
        .mul(userShare1Numerator)
        .div(userShare1Denominator);
      const owner2Balance = expectedRewards
        .mul(userShare2Numerator)
        .div(userShare2Denominator);
      console.log(`total rewards expected:${expectedRewards.toString()}`);
      console.log(`owner share of rewards: ${owner1Balance.toString()}`);
      console.log(`owner2 share of rewards: ${owner2Balance.toString()}`);
      console.log(`actual rewards: ${rewards.toString()}`);
      console.log(`actual rewards2: ${rewards2.toString()}`);
      assert.equal(
        truncateString(rewards.toString()),
        truncateString(owner1Balance.toString())
      );
      assert.equal(rewards2.toString(), owner2Balance.toString());
    });
  });
});
