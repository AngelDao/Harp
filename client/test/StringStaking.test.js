/* eslint-disable no-undef */
/* eslint-disable jest/valid-describe */
const { assert } = require("chai");
const timeMachine = require("ganache-time-traveler");

const StringToken = artifacts.require("StringToken");
const gStringTokenArt = artifacts.require("gStringToken");
const StringStaking = artifacts.require("StringStaking");
const LQTYToken = artifacts.require("LQTYToken");

require("chai").use(require("chai-as-promised")).should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

const makeBN = (n) => {
  return new web3.utils.BN(n);
};

const advanceBlock = async (n) => {
  for (let i = 0; i < n; i++) {
    await timeMachine.advanceBlock();
  }
};

contract("String Staking Test", (accounts) => {
  let stringToken, tokenVesting, gStringToken, stringStaking, lqtyToken;
  beforeEach(async () => {
    let snapshot = await timeMachine.takeSnapshot();
    snapshotId = snapshot["result"];
  });

  afterEach(async () => {
    await timeMachine.revertToSnapshot(snapshotId);
  });
  beforeEach(async () => {
    const AngelDAOAddress = accounts[2];
    const HarpDAOAddress = accounts[1];
    const owner = accounts[3];
    stringToken = await StringToken.new(
      "ozString",
      "ozSTRING",
      HarpDAOAddress,
      owner
    );

    gStringToken = await gStringTokenArt.new(owner);
    lqtyToken = await LQTYToken.new(owner, HarpDAOAddress);

    await stringToken.addVestingAddress(owner, { from: owner });
    // await gStringToken.addVestingAddress(owner, { from: owner });
    await stringToken.mintTo(owner, tokens("1000"), { from: owner });
    await stringToken.mintTo(accounts[1], tokens("1000"), { from: owner });
    await stringToken.mintTo(accounts[2], tokens("1000"), { from: owner });
    await stringToken.mintTo(accounts[0], tokens("1000"), { from: owner });

    stringStaking = await StringStaking.new(
      stringToken.address,
      100,
      lqtyToken.address,
      gStringToken.address
    );

    await stringToken.addVestingAddress(stringStaking.address, { from: owner });
    await gStringToken.addVestingAddress(stringStaking.address, {
      from: owner,
    });
  });

  describe("Token Attributes Check On Deployment", async () => {
    it("Sets correct pool info upon deployment", async () => {
      let pool = await stringStaking.pool();
      assert.equal(pool.lpToken, stringToken.address);
      assert.equal(pool.lpTokenSupply, 0);
      assert.equal(pool.accStringPerShare, 0);
      assert.equal(pool.accLQTYPerShare, 0);
    });
  });

  describe("Token Contract actions", async () => {
    it("Deposit successfully", async () => {
      const depositer = accounts[0];
      await stringToken.approve(stringStaking.address, tokens("2000"), {
        from: depositer,
      });
      await stringStaking.deposit(tokens("500"), { from: depositer });
      const denominator = makeBN(1000);
      const depositedSTRING = makeBN(5000);
      const fee = depositedSTRING.div(denominator);
      const expectedBalance = depositedSTRING.sub(fee);

      console.log(expectedBalance);

      const STRINGPerShareMulti = makeBN("1000000000000");
      console.log(STRINGPerShareMulti.toString());
      console.log(fee.toString());
      const expectedStringPerShare = fee
        .mul(STRINGPerShareMulti)
        .div(expectedBalance);

      console.log(expectedBalance);
      const gStringBal = (await gStringToken.balanceOf(depositer))
        .mul(makeBN(10))
        .toString();
      const user = await stringStaking.userInfo(depositer);
      const pool = await stringStaking.pool();

      console.log(expectedBalance);
      assert.equal(
        pool.lpTokenSupply.mul(makeBN(10)).toString(),
        tokens(depositedSTRING.sub(fee).toString())
      );

      assert.equal(
        pool.accStringPerShare.toString(),
        expectedStringPerShare.toString()
      );

      assert.equal(
        user.amount.mul(makeBN(10)).toString(),
        tokens(depositedSTRING.sub(fee).toString())
      );
      assert.equal(user.rewardDebt, 0);
      assert.equal(user.lqtyRewardDebt, 0);

      assert.equal(tokens(depositedSTRING.sub(fee).toString()), gStringBal);
    });

    it("Withdraw successfully", async () => {
      const depositer = accounts[0];
      await stringToken.approve(stringStaking.address, tokens("2000"), {
        from: depositer,
      });
      const stringBalFirst = (
        await stringToken.balanceOf(depositer)
      ).toString();
      console.log(stringBalFirst);
      await stringStaking.deposit(tokens("500"), { from: depositer });
      const userFirst = await stringStaking.userInfo(depositer);
      const contractString = await stringToken.balanceOf(stringStaking.address);
      console.log(contractString.toString());
      console.log(userFirst.amount.toString());
      console.log(tokens("499.5"));
      await advanceBlock(10);
      await gStringToken.approve(stringStaking.address, tokens("2000"), {
        from: depositer,
      });
      await stringStaking.withdraw(tokens("499.5"), { from: depositer });

      // const gSTRINGBal = (await gStringToken.balanceOf(depositer)).toString();
      const stringBal = (await stringToken.balanceOf(depositer)).toString();
      const user = await stringStaking.userInfo(depositer);
      const pool = await stringStaking.pool();
      const rewardPerBlock = makeBN("230769230800000000");
      const blocksCount = makeBN(12);
      const boosted = makeBN(5);
      const expectedRewards = rewardPerBlock.mul(blocksCount).mul(boosted);
      const base = makeBN(tokens("1000"));

      // assert.equal(gSTRINGBal, 0);
      assert.equal(stringBal.toString(), base.add(expectedRewards).toString());
      assert.equal(user.amount, 0);
      assert.equal(pool.lpTokenSupply, 0);
    });
  });
});
