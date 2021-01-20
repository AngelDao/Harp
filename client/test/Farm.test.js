// const { assert } = require("chai");
// const timeMachine = require("ganache-time-traveler");

// const StringToken = artifacts.require("StringToken");
// const LUSDLP = artifacts.require("LUSDLPToken");
// const ETHLP = artifacts.require("ETHLPToken");
// // const Farm = artifacts.require("Farm");
// const LatestFarm = artifacts.require("LatestFarm");

// const SECOND = 1000;
// const HOUR = 60 * 60;
// const DAY = 24 * HOUR;

// require("chai").use(require("chai-as-promised")).should();

// function tokens(n) {
//   return web3.utils.toWei(n, "ether");
// }

// const truncateString = (str) => {
//   return str.substr(0, 8);
// };

// function readableTokens(n) {
//   return web3.utils.toWei(n, "wei");
// }

// contract("Farm Tests", async (accounts) => {
//   // const accounts = await ethers.getSigners();
//   let stringToken, farm, ethLPToken, lusdLPToken, clock;
//   beforeEach(async () => {
//     let snapshot = await timeMachine.takeSnapshot();
//     snapshotId = snapshot["result"];
//   });

//   afterEach(async () => {
//     await timeMachine.revertToSnapshot(snapshotId);
//   });

//   before(async () => {
//     const HarpDAOAddress = accounts[2];
//     const owner = accounts[1];
//     const owner2 = accounts[5];
//     const ownerToken = accounts[3];
//     // const StringToken = await ethers.getContractFactory("StringToken");
//     // const LUSDLP = await ethers.getContractFactory("LUSDLPToken");
//     // const ETHLP = await ethers.getContractFactory("ETHLP");
//     // const Farm = await ethers.getContractFactory("Farm");

//     stringToken = await StringToken.new(
//       "ozString",
//       "ozSTRING",
//       HarpDAOAddress,
//       ownerToken
//     );
//     // const greeter = await Greeter.deploy("Hello, world!");

//     ethLPToken = await ETHLP.new(owner, owner2);
//     lusdLPToken = await LUSDLP.new(owner, owner2);

//     farm = await LatestFarm.new(stringToken.address);

//     farm.add(20, lusdLPToken.address, true);
//     farm.add(80, ethLPToken.address, true);
//     await stringToken.addVestingAddress(farm.address, { from: ownerToken });
//   });

//   // describe("Farm attributes on deployment", async () => {
//   //   it("Sets correct isStarted Bool on Deployment", async () => {
//   //     const isStarted = await farm.isStarted();
//   //     assert.equal(isStarted, false);
//   //   });
//   //   it("Sets correct max allocation size for entire Farm", async () => {
//   //     const max = (await farm.farmAllocation()).toString();
//   //     assert.equal(max, tokens("5600000"));
//   //   });
//   //   it("Sets correct max allocation size for eth pool", async () => {
//   //     const max = (await farm.ethAllocation()).toString();
//   //     assert.equal(max, tokens("4480000"));
//   //   });
//   //   it("Sets correct max allocation size for lusd pool", async () => {
//   //     const max = (await farm.lusdAllocation()).toString();
//   //     assert.equal(max, tokens("1120000"));
//   //   });
//   //   it("Sets claimed tokens correctly", async () => {
//   //     const claimed = (await farm.farmTokensClaimed()).toString();
//   //     assert.equal(claimed, tokens("0"));
//   //   });
//   //   it("Sets correct boost multiplier", async () => {
//   //     const boost = await farm.boostedMultiplier();
//   //     assert.equal(boost, 5);
//   //   });
//   //   it("Sets correct boost divisor", async () => {
//   //     const boost = await farm.boostedDivisor();
//   //     assert.equal(boost, 2);
//   //   });
//   //   it("Sets correct eth pool numerator", async () => {
//   //     const boost = await farm.ETHPoolNumerator();
//   //     assert.equal(boost, 8);
//   //   });
//   //   it("Sets correct eth pool denominator", async () => {
//   //     const boost = await farm.ETHPoolDenominator();
//   //     assert.equal(boost, 10);
//   //   });
//   //   it("Sets correct lusd pool numerator", async () => {
//   //     const boost = await farm.LUSDPoolNumerator();
//   //     assert.equal(boost, 2);
//   //   });
//   //   it("Sets correct lusd pool denominator", async () => {
//   //     const boost = await farm.LUSDPoolDenominator();
//   //     assert.equal(boost, 10);
//   //   });
//   //   it("Sets correct eth lp address", async () => {
//   //     const started = await farm.ethLpToken();
//   //     assert.equal(started, ethLPToken.address);
//   //   });
//   //   it("Sets correct lusd lp address", async () => {
//   //     const started = await farm.lusdLpToken();
//   //     assert.equal(started, lusdLPToken.address);
//   //   });
//   //   it("Sets correct stringtoken address", async () => {
//   //     const started = await farm.stringToken();
//   //     assert.equal(started, stringToken.address);
//   //   });
//   //   it("Sets correct rewardperblock", async () => {
//   //     const reward = await farm.rewardPerBlock();
//   //     assert.equal(reward, tokens("0.358974359"));
//   //   });
//   // });

//   describe("Farm actions", async () => {
//     // it("create the initial pools", async () => {
//     //   await farm.addInitialPools();
//     //   const isStarted = await farm.isStarted();
//     //   const startBlock = await farm.startBlock();
//     //   const pool1 = await farm.pools(0);
//     //   const pool2 = await farm.pools(1);
//     //   const farmBlockRewards = new web3.utils.BN(tokens("0.358974359"));
//     //   const ethNumerator = new web3.utils.BN(8);
//     //   const lusdDenominator = new web3.utils.BN(10);
//     //   const lusdNumerator = new web3.utils.BN(2);
//     //   const ethDenominator = new web3.utils.BN(10);
//     //   const pool1Rewards = farmBlockRewards
//     //     .mul(ethNumerator)
//     //     .div(ethDenominator);
//     //   const pool2Rewards = farmBlockRewards
//     //     .mul(lusdNumerator)
//     //     .div(lusdDenominator);
//     //   assert.equal(pool1["isBoosted"], true);
//     //   assert.equal(pool1["isRewarding"], true);
//     //   assert.equal(pool1["maxRewardsToGive"], tokens("4480000"));
//     //   assert.equal(pool1["currentRewardsGiven"], 0);
//     //   assert.equal(pool1["amountStaked"], 0);
//     //   assert.equal(pool1["lpToken"], ethLPToken.address);
//     //   assert.equal(pool1["rewardPerBlock"].toString(), pool1Rewards.toString());
//     //   assert.equal(pool2["rewardPerBlock"].toString(), pool2Rewards.toString());
//     //   assert.equal(pool2["isBoosted"], true);
//     //   assert.equal(pool2["isRewarding"], true);
//     //   assert.equal(pool2["maxRewardsToGive"], tokens("1120000"));
//     //   assert.equal(pool2["currentRewardsGiven"], 0);
//     //   assert.equal(pool2["amountStaked"], 0);
//     //   assert.equal(pool2["lpToken"], lusdLPToken.address);
//     //   assert.equal(isStarted, true);
//     //   assert.equal(startBlock > 0, true);
//     // });

//     // it("deposit in pool 1", async () => {
//     //   let owner = accounts[1];
//     //   await farm.addInitialPools();
//     //   await ethLPToken.approve(farm.address, tokens("100"), { from: owner });
//     //   await farm.deposit(tokens("10"), 0, { from: owner });
//     //   const userBalance = (await ethLPToken.balanceOf(owner)).toString();
//     //   const farmBalance = (await ethLPToken.balanceOf(farm.address)).toString();
//     //   const poolBalance = (await farm.pools(0))["amountStaked"].toString();
//     //   const userAccount = await farm.poolUsers(0, owner);

//     //   assert.equal(!userAccount["lastClaimedBlock"].isZero(), true);
//     //   assert.equal(userAccount["balance"], tokens("10"));
//     //   assert.equal(userBalance, tokens("990"));
//     //   assert.equal(farmBalance, tokens("10"));
//     //   assert.equal(poolBalance, tokens("10"));
//     // });

//     // it("deposit in pool 2", async () => {
//     //   let owner = accounts[1];
//     //   await farm.addInitialPools();
//     //   await lusdLPToken.approve(farm.address, tokens("100"), { from: owner });
//     //   await farm.deposit(tokens("10"), 1, { from: owner });
//     //   const userBalance = (await lusdLPToken.balanceOf(owner)).toString();
//     //   const farmBalance = (
//     //     await lusdLPToken.balanceOf(farm.address)
//     //   ).toString();
//     //   const poolBalance = (await farm.pools(1))["amountStaked"].toString();
//     //   const userAccount = await farm.poolUsers(1, owner);

//     //   assert.equal(!userAccount["lastClaimedBlock"].isZero(), true);
//     //   assert.equal(userBalance, tokens("990"));
//     //   assert.equal(farmBalance, tokens("10"));
//     //   assert.equal(poolBalance, tokens("10"));
//     // });

//     // it("withdraw full from pool1", async () => {
//     //   let owner = accounts[1];
//     //   const testrewards = await stringToken.balanceOf(owner);
//     //   console.log(testrewards.toString());
//     //   await farm.addInitialPools();
//     //   await ethLPToken.approve(farm.address, tokens("100"), { from: owner });
//     //   await farm.deposit(tokens("10"), 0, { from: owner });
//     //   const beforeUserAcc = await farm.poolUsers(0, owner);
//     //   const beforeBlock = beforeUserAcc["lastClaimedBlock"].toNumber();
//     //   console.log(beforeBlock);
//     //   // 9 block
//     //   await timeMachine.advanceBlock();
//     //   await timeMachine.advanceBlock();
//     //   await timeMachine.advanceBlock();
//     //   await timeMachine.advanceBlock();
//     //   await timeMachine.advanceBlock();
//     //   await timeMachine.advanceBlock();
//     //   await timeMachine.advanceBlock();
//     //   await timeMachine.advanceBlock();
//     //   await timeMachine.advanceBlock();
//     //   await farm.withdraw(0, tokens("10"), { from: owner });
//     //   const userBalance = (await ethLPToken.balanceOf(owner)).toString();
//     //   const farmBalance = (await ethLPToken.balanceOf(farm.address)).toString();
//     //   const pool = await farm.pools(0);
//     //   const afterUserAcc = await farm.poolUsers(0, owner);
//     //   const rewards = await stringToken.balanceOf(owner);
//     //   const afterBlock = afterUserAcc["lastClaimedBlock"].toNumber();
//     //   const newBlocks = afterBlock - beforeBlock;
//     //   const newBN = new web3.utils.BN(newBlocks);
//     //   const five = new web3.utils.BN(5);
//     //   const expectedRewards = pool["rewardPerBlock"].mul(five).mul(newBN);
//     //   console.log(expectedRewards.toString());
//     //   console.log(rewards.toString());
//     //   assert.equal(rewards.toString(), expectedRewards.toString());
//     //   assert.equal(
//     //     beforeUserAcc["lastClaimedBlock"].lt(afterUserAcc["lastClaimedBlock"]),
//     //     true
//     //   );
//     //   assert.equal(userBalance, tokens("1000"));
//     //   assert.equal(farmBalance, tokens("0"));
//     //   assert.equal(pool["amountStaked"].toString(), tokens("0"));
//     //   assert.equal(
//     //     pool["currentRewardsGiven"].toString(),
//     //     expectedRewards.toString()
//     //   );
//     // });

//     // it("withdraw full from pool2", async () => {
//     //   let owner = accounts[1];
//     //   const testrewards = await stringToken.balanceOf(owner);
//     //   console.log(testrewards.toString());
//     //   await farm.addInitialPools();
//     //   await lusdLPToken.approve(farm.address, tokens("100"), { from: owner });
//     //   await farm.deposit(tokens("10"), 1, { from: owner });
//     //   const beforeUserAcc = await farm.poolUsers(1, owner);
//     //   const beforeBlock = beforeUserAcc["lastClaimedBlock"].toNumber();
//     //   console.log(beforeBlock);
//     //   // 9 block
//     //   await timeMachine.advanceBlock();
//     //   await timeMachine.advanceBlock();
//     //   await timeMachine.advanceBlock();
//     //   await timeMachine.advanceBlock();
//     //   await timeMachine.advanceBlock();
//     //   await timeMachine.advanceBlock();
//     //   await timeMachine.advanceBlock();
//     //   await timeMachine.advanceBlock();
//     //   await timeMachine.advanceBlock();
//     //   await farm.withdraw(1, tokens("10"), { from: owner });
//     //   const userBalance = (await lusdLPToken.balanceOf(owner)).toString();
//     //   const farmBalance = (
//     //     await lusdLPToken.balanceOf(farm.address)
//     //   ).toString();
//     //   const pool = await farm.pools(1);
//     //   const afterUserAcc = await farm.poolUsers(1, owner);
//     //   const rewards = await stringToken.balanceOf(owner);
//     //   const afterBlock = afterUserAcc["lastClaimedBlock"].toNumber();
//     //   const newBlocks = afterBlock - beforeBlock;
//     //   const newBN = new web3.utils.BN(newBlocks);
//     //   const five = new web3.utils.BN(5);
//     //   const expectedRewards = pool["rewardPerBlock"].mul(five).mul(newBN);
//     //   console.log(expectedRewards.toString());
//     //   console.log(rewards.toString());
//     //   assert.equal(rewards.toString(), expectedRewards.toString());
//     //   assert.equal(
//     //     beforeUserAcc["lastClaimedBlock"].lt(afterUserAcc["lastClaimedBlock"]),
//     //     true
//     //   );
//     //   assert.equal(userBalance, tokens("1000"));
//     //   assert.equal(farmBalance, tokens("0"));
//     //   assert.equal(pool["amountStaked"].toString(), tokens("0"));
//     //   assert.equal(
//     //     pool["currentRewardsGiven"].toString(),
//     //     expectedRewards.toString()
//     //   );
//     // });

//     // it("2 users deposit in pool 1", async () => {
//     //   let owner = accounts[1];
//     //   let owner3 = accounts[5];
//     //   await farm.addInitialPools();
//     //   await ethLPToken.approve(farm.address, tokens("100"), { from: owner });
//     //   await ethLPToken.approve(farm.address, tokens("100"), { from: owner3 });
//     //   await farm.deposit(tokens("10"), 0, { from: owner });
//     //   await farm.deposit(tokens("50"), 0, { from: owner3 });
//     //   const userBalance = (await ethLPToken.balanceOf(owner)).toString();
//     //   const userBalance3 = (await ethLPToken.balanceOf(owner3)).toString();
//     //   const farmBalance = (await ethLPToken.balanceOf(farm.address)).toString();
//     //   const poolBalance = (await farm.pools(0))["amountStaked"].toString();
//     //   const userAccount = await farm.poolUsers(0, owner);
//     //   const userAccount3 = await farm.poolUsers(0, owner3);

//     //   assert.equal(!userAccount["lastClaimedBlock"].isZero(), true);
//     //   assert.equal(userAccount["balance"], tokens("10"));
//     //   assert.equal(userAccount3["balance"], tokens("50"));
//     //   assert.equal(userBalance, tokens("990"));
//     //   assert.equal(userBalance3, tokens("950"));
//     //   assert.equal(farmBalance, tokens("60"));
//     //   assert.equal(poolBalance, tokens("60"));
//     // });

//     // it("2 users deposit in pool 1 then 1 withdraws half", async () => {
//     //   let owner = accounts[1];
//     //   let owner3 = accounts[5];
//     //   await farm.addInitialPools();
//     //   await ethLPToken.approve(farm.address, tokens("100"), { from: owner });
//     //   await ethLPToken.approve(farm.address, tokens("100"), { from: owner3 });
//     //   await farm.deposit(tokens("10"), 0, { from: owner });
//     //   await farm.deposit(tokens("50"), 0, { from: owner3 });
//     //   let userBalance = (await ethLPToken.balanceOf(owner)).toString();
//     //   let userBalance3 = (await ethLPToken.balanceOf(owner3)).toString();
//     //   let farmBalance = (await ethLPToken.balanceOf(farm.address)).toString();
//     //   let poolBalance = (await farm.pools(0))["amountStaked"].toString();
//     //   let userAccount = await farm.poolUsers(0, owner);
//     //   let userAccount3 = await farm.poolUsers(0, owner3);

//     //   assert.equal(!userAccount["lastClaimedBlock"].isZero(), true);
//     //   assert.equal(userAccount["balance"], tokens("10"));
//     //   assert.equal(userAccount3["balance"], tokens("50"));
//     //   assert.equal(userBalance, tokens("990"));
//     //   assert.equal(userBalance3, tokens("950"));
//     //   assert.equal(farmBalance, tokens("60"));
//     //   assert.equal(poolBalance, tokens("60"));

//     //   await farm.withdraw(0, tokens("25"), { from: owner3 });

//     //   userBalance = (await ethLPToken.balanceOf(owner)).toString();
//     //   userBalance3 = (await ethLPToken.balanceOf(owner3)).toString();
//     //   farmBalance = (await ethLPToken.balanceOf(farm.address)).toString();
//     //   poolBalance = (await farm.pools(0))["amountStaked"].toString();
//     //   userAccount = await farm.poolUsers(0, owner);
//     //   userAccount3 = await farm.poolUsers(0, owner3);

//     //   assert.equal(userAccount["balance"], tokens("10"));
//     //   assert.equal(userAccount3["balance"], tokens("25"));
//     //   assert.equal(userBalance, tokens("990"));
//     //   assert.equal(userBalance3, tokens("975"));
//     //   assert.equal(farmBalance, tokens("35"));
//     //   assert.equal(poolBalance, tokens("35"));
//     // });

//     // it("2 users deposit in pool 1 then 1 withdraws", async () => {
//     //   let owner = accounts[1];
//     //   let owner3 = accounts[5];
//     //   await farm.addInitialPools();
//     //   await ethLPToken.approve(farm.address, tokens("100"), { from: owner });
//     //   await ethLPToken.approve(farm.address, tokens("100"), { from: owner3 });
//     //   await farm.deposit(tokens("10"), 0, { from: owner });
//     //   await farm.deposit(tokens("50"), 0, { from: owner3 });
//     //   let userBalance = (await ethLPToken.balanceOf(owner)).toString();
//     //   let userBalance3 = (await ethLPToken.balanceOf(owner3)).toString();
//     //   let farmBalance = (await ethLPToken.balanceOf(farm.address)).toString();
//     //   let poolBalance = (await farm.pools(0))["amountStaked"].toString();
//     //   let userAccount = await farm.poolUsers(0, owner);
//     //   let userAccount3 = await farm.poolUsers(0, owner3);

//     //   assert.equal(!userAccount["lastClaimedBlock"].isZero(), true);
//     //   assert.equal(userAccount["balance"], tokens("10"));
//     //   assert.equal(userAccount3["balance"], tokens("50"));
//     //   assert.equal(userBalance, tokens("990"));
//     //   assert.equal(userBalance3, tokens("950"));
//     //   assert.equal(farmBalance, tokens("60"));
//     //   assert.equal(poolBalance, tokens("60"));

//     //   await farm.withdraw(0, tokens("50"), { from: owner3 });

//     //   userBalance = (await ethLPToken.balanceOf(owner)).toString();
//     //   userBalance3 = (await ethLPToken.balanceOf(owner3)).toString();
//     //   farmBalance = (await ethLPToken.balanceOf(farm.address)).toString();
//     //   poolBalance = (await farm.pools(0))["amountStaked"].toString();
//     //   userAccount = await farm.poolUsers(0, owner);
//     //   userAccount3 = await farm.poolUsers(0, owner3);

//     //   assert.equal(userAccount["balance"], tokens("10"));
//     //   assert.equal(userAccount3["balance"], tokens("0"));
//     //   assert.equal(userBalance, tokens("990"));
//     //   assert.equal(userBalance3, tokens("1000"));
//     //   assert.equal(farmBalance, tokens("10"));
//     //   assert.equal(poolBalance, tokens("10"));
//     // });

//     // it("2 users deposit in pool 1 then both withdraws half", async () => {
//     //   let owner = accounts[1];
//     //   let owner3 = accounts[5];
//     //   await farm.addInitialPools();
//     //   await ethLPToken.approve(farm.address, tokens("100"), { from: owner });
//     //   await ethLPToken.approve(farm.address, tokens("100"), { from: owner3 });
//     //   await farm.deposit(tokens("10"), 0, { from: owner });
//     //   await farm.deposit(tokens("50"), 0, { from: owner3 });
//     //   let userBalance = (await ethLPToken.balanceOf(owner)).toString();
//     //   let userBalance3 = (await ethLPToken.balanceOf(owner3)).toString();
//     //   let farmBalance = (await ethLPToken.balanceOf(farm.address)).toString();
//     //   let poolBalance = (await farm.pools(0))["amountStaked"].toString();
//     //   let userAccount = await farm.poolUsers(0, owner);
//     //   let userAccount3 = await farm.poolUsers(0, owner3);

//     //   assert.equal(!userAccount["lastClaimedBlock"].isZero(), true);
//     //   assert.equal(userAccount["balance"], tokens("10"));
//     //   assert.equal(userAccount3["balance"].toString(), tokens("50"));
//     //   assert.equal(userBalance, tokens("990"));
//     //   assert.equal(userBalance3, tokens("950"));
//     //   assert.equal(farmBalance, tokens("60"));
//     //   assert.equal(poolBalance, tokens("60"));

//     //   await farm.withdraw(0, tokens("25"), { from: owner3 });
//     //   await farm.withdraw(0, tokens("5"), { from: owner });

//     //   userBalance = (await ethLPToken.balanceOf(owner)).toString();
//     //   userBalance3 = (await ethLPToken.balanceOf(owner3)).toString();
//     //   farmBalance = (await ethLPToken.balanceOf(farm.address)).toString();
//     //   poolBalance = (await farm.pools(0))["amountStaked"].toString();
//     //   userAccount = await farm.poolUsers(0, owner);
//     //   userAccount3 = await farm.poolUsers(0, owner3);

//     //   assert.equal(userAccount["balance"].toString(), tokens("5"));
//     //   assert.equal(userAccount3["balance"], tokens("25"));
//     //   assert.equal(userBalance, tokens("995"));
//     //   assert.equal(userBalance3, tokens("975"));
//     //   assert.equal(farmBalance, tokens("30"));
//     //   assert.equal(poolBalance, tokens("30"));
//     // });

//     // it("2 users deposit in pool 1 then both withdraw ", async () => {
//     //   let owner = accounts[1];
//     //   let owner3 = accounts[5];
//     //   await farm.addInitialPools();
//     //   await ethLPToken.approve(farm.address, tokens("100"), { from: owner });
//     //   await ethLPToken.approve(farm.address, tokens("100"), { from: owner3 });
//     //   await farm.deposit(tokens("10"), 0, { from: owner });
//     //   await farm.deposit(tokens("50"), 0, { from: owner3 });
//     //   let userBalance = (await ethLPToken.balanceOf(owner)).toString();
//     //   let userBalance3 = (await ethLPToken.balanceOf(owner3)).toString();
//     //   let farmBalance = (await ethLPToken.balanceOf(farm.address)).toString();
//     //   let poolBalance = (await farm.pools(0))["amountStaked"].toString();
//     //   let userAccount = await farm.poolUsers(0, owner);
//     //   let userAccount3 = await farm.poolUsers(0, owner3);

//     //   assert.equal(!userAccount["lastClaimedBlock"].isZero(), true);
//     //   assert.equal(userAccount["balance"], tokens("10"));
//     //   assert.equal(userAccount3["balance"], tokens("50"));
//     //   assert.equal(userBalance, tokens("990"));
//     //   assert.equal(userBalance3, tokens("950"));
//     //   assert.equal(farmBalance, tokens("60"));
//     //   assert.equal(poolBalance, tokens("60"));

//     //   await farm.withdraw(0, tokens("10"), { from: owner });
//     //   await farm.withdraw(0, tokens("50"), { from: owner3 });

//     //   userBalance = (await ethLPToken.balanceOf(owner)).toString();
//     //   userBalance3 = (await ethLPToken.balanceOf(owner3)).toString();
//     //   farmBalance = (await ethLPToken.balanceOf(farm.address)).toString();
//     //   poolBalance = (await farm.pools(0))["amountStaked"].toString();
//     //   userAccount = await farm.poolUsers(0, owner);
//     //   userAccount3 = await farm.poolUsers(0, owner3);

//     //   assert.equal(userAccount["balance"], tokens("0"));
//     //   assert.equal(userAccount3["balance"], tokens("0"));
//     //   assert.equal(userBalance, tokens("1000"));
//     //   assert.equal(userBalance3, tokens("1000"));
//     //   assert.equal(farmBalance, tokens("0"));
//     //   assert.equal(poolBalance, tokens("0"));
//     // });

//     // it("2 users deposit in pool 1 overwithdraws ", async () => {
//     //   let owner = accounts[1];
//     //   let owner3 = accounts[5];
//     //   await farm.addInitialPools();
//     //   await ethLPToken.approve(farm.address, tokens("100"), { from: owner });
//     //   await ethLPToken.approve(farm.address, tokens("100"), { from: owner3 });
//     //   await farm.deposit(tokens("10"), 0, { from: owner });
//     //   await farm.deposit(tokens("50"), 0, { from: owner3 });
//     //   let userBalance = (await ethLPToken.balanceOf(owner)).toString();
//     //   let userBalance3 = (await ethLPToken.balanceOf(owner3)).toString();
//     //   let farmBalance = (await ethLPToken.balanceOf(farm.address)).toString();
//     //   let poolBalance = (await farm.pools(0))["amountStaked"].toString();
//     //   let userAccount = await farm.poolUsers(0, owner);
//     //   let userAccount3 = await farm.poolUsers(0, owner3);

//     //   assert.equal(!userAccount["lastClaimedBlock"].isZero(), true);
//     //   assert.equal(userAccount["balance"], tokens("10"));
//     //   assert.equal(userAccount3["balance"], tokens("50"));
//     //   assert.equal(userBalance, tokens("990"));
//     //   assert.equal(userBalance3, tokens("950"));
//     //   assert.equal(farmBalance, tokens("60"));
//     //   assert.equal(poolBalance, tokens("60"));

//     //   try {
//     //     await farm.withdraw(0, tokens("50"), { from: owner });
//     //   } catch (err) {
//     //     assert(
//     //       err.message.indexOf("revert") >= 0,
//     //       "error message must contain revert"
//     //     );
//     //   }
//     // });

//     it("rewards for 2 depositers", async () => {
//       let owner = accounts[1];
//       let owner2 = accounts[5];
//       await farm.addInitialPools();
//       await ethLPToken.approve(farm.address, tokens("100"), { from: owner });
//       await ethLPToken.approve(farm.address, tokens("100"), { from: owner2 });
//       await farm.deposit(tokens("10"), 0, { from: owner });
//       await farm.deposit(tokens("20"), 0, { from: owner2 });
//       const beforePool = await farm.pools(0);
//       const beforeUserAcc = await farm.poolUsers(0, owner);
//       const beforeUserAcc2 = await farm.poolUsers(0, owner2);
//       const beforeBlock = beforeUserAcc["lastClaimedBlock"].toNumber();
//       console.log(`block number before advance: ${beforeBlock}`);
//       // 9 block
//       await timeMachine.advanceBlock();
//       await timeMachine.advanceBlock();
//       await timeMachine.advanceBlock();
//       await timeMachine.advanceBlock();
//       await timeMachine.advanceBlock();
//       await timeMachine.advanceBlock();
//       await timeMachine.advanceBlock();
//       await timeMachine.advanceBlock();
//       const poolRewards = await farm._getPendingRewards(0, { from: owner });
//       console.log(
//         `rewards outstanding before withdraw after advance: ${poolRewards.toString()}`
//       );
//       const poolBalance = beforePool["amountStaked"];
//       console.log(
//         `Balance of pool after advancement: ${poolBalance.toString()}`
//       );
//       console.log(
//         `owner balance after: ${beforeUserAcc["balance"].toString()}`
//       );
//       console.log(
//         `owner2 balance after: ${beforeUserAcc2["balance"].toString()}`
//       );
//       const userShare1Numerator = new web3.utils.BN(1);
//       const userShare1Denominator = new web3.utils.BN(3);
//       const userShare2Numerator = new web3.utils.BN(2);
//       const userShare2Denominator = new web3.utils.BN(3);
//       await farm.withdraw(0, tokens("10"), { from: owner });
//       // await farm.withdraw(0, tokens("20"), { from: owner2 });
//       const ownerStringBal = (await stringToken.balanceOf(owner)).toString();

//       const userBalance = (await ethLPToken.balanceOf(owner)).toString();
//       // const userBalance2 = (await ethLPToken.balanceOf(owner2)).toString();
//       const farmBalance = (await ethLPToken.balanceOf(farm.address)).toString();
//       const pool = await farm.pools(0);
//       console.log(`pool bal after withdraw: ${pool.amountStaked.toString()}`);
//       const afterUserAcc = await farm.poolUsers(0, owner);
//       // const afterUserAcc2 = await farm.poolUsers(0, owner2);
//       const rewards = await stringToken.balanceOf(owner);
//       // const rewards2 = await stringToken.balanceOf(owner2);
//       const afterBlock = afterUserAcc["lastClaimedBlock"].toNumber();
//       console.log(`block count after advancement: ${afterBlock}`);
//       const newBlocks = afterBlock - beforeBlock;
//       console.log(`amount of new blocks since advancements: ${newBlocks}`);
//       const newBN = new web3.utils.BN(newBlocks);
//       const five = new web3.utils.BN(5);
//       // console.log(pool.rewardPerBlock.toString());
//       const expectedRewards = pool["rewardPerBlock"].mul(five).mul(newBN);
//       const owner1Balance = expectedRewards
//         .mul(userShare1Numerator)
//         .div(userShare1Denominator);
//       // const owner2Balance = expectedRewards
//       //   .mul(userShare2Numerator)
//       //   .div(userShare2Denominator);
//       console.log(`total rewards expected:${expectedRewards.toString()}`);
//       console.log(`owner share of rewards: ${owner1Balance.toString()}`);
//       // console.log(`owner1 share of rewards: ${owner2Balance.toString()}`);
//       console.log(`actual rewards: ${rewards.toString()}`);
//       assert.equal(
//         truncateString(rewards.toString()),
//         truncateString(owner1Balance.toString())
//       );
//       // // assert.equal(rewards2.toString(), owner2Balance.toString());
//       // assert.equal(
//       //   beforeUserAcc["lastClaimedBlock"].lt(afterUserAcc["lastClaimedBlock"]),
//       //   true
//       // );
//       // // assert.equal(
//       // //   beforeUserAcc2["lastClaimedBlock"].lt(
//       // //     afterUserAcc2["lastClaimedBlock"]
//       // //   ),
//       // //   true
//       // // );
//       // assert.equal(userBalance, tokens("1000"));
//       // // assert.equal(userBalance2, tokens("1000"));
//       // assert.equal(farmBalance, tokens("0"));
//       // assert.equal(pool["amountStaked"].toString(), tokens("0"));
//       // assert.equal(
//       //   pool["currentRewardsGiven"].toString(),
//       //   expectedRewards.toString()
//       // );
//     });
//   });
// });
