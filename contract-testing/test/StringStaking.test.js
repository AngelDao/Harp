// /* eslint-disable jest/valid-describe */
// /* eslint-disable no-undef */
// const { assert, expect } = require("chai");
// const deploymentHelperLiquity = require("../utils/deploymentHelperLiquity");
// const deploymentHelperHarp = require("../utils/deploymentHelperHarp");
// const { ethers, artifacts } = require("hardhat");
// const testHelpers = require("../utils/testHelpers.js");
// require("chai").use(require("chai-as-promised")).should();
// const StabilityPool = artifacts.require("./StabilityPool.sol");
// const BigNumber = require("bignumber.js");
// const th = testHelpers.TestHelper;

// const SECOND = 1000;
// const HOUR = 60 * 60;
// const DAY = 24 * HOUR;

// function tokens(n) {
//   return web3.utils.toWei(n, "ether");
// }

// const truncateString = (str) => {
//   return str.substr(0, 4);
// };

// const makeBN = (n) => {
//   return new web3.utils.BN(n);
// };

// const advanceBlock = async (n) => {
//   await web3.currentProvider.send(
//     {
//       id: 0,
//       jsonrpc: "2.0",
//       method: "evm_setIntervalMining",
//       params: [5000],
//     },
//     (err) => {
//       //   if (err) console.log(err);
//     }
//   );
//   for (let i = 0; i < n; i++) {
//     await th.fastForwardTime(5000, web3.currentProvider);
//   }
// };

// contract("STRING Staking Tests", () => {
//   let contracts,
//     accounts,
//     harpContracts,
//     stringToken,
//     gstringToken,
//     lqtyTestToken;

//   const HarpDAO = "0xdF7054884fCb9A8681490A1D977fbD295C02cCFF";
//   const AngelDAO = "0x3Af2d668Afd7eF2B94b0862aE759712c067DFa4c";

//   const yearsToLockUp = 365;

//   beforeEach(async () => {
//     accounts = await ethers.getSigners();
//     contracts = await deploymentHelperLiquity.deployLiquityCore();
//     const LQTYContracts = await deploymentHelperLiquity.deployLQTYTesterContractsHardhat(
//       accounts[1].address,
//       accounts[2].address,
//       accounts[3].address
//     );
//     contracts.stabilityPool = await StabilityPool.new();

//     contracts = await deploymentHelperLiquity.deployLUSDToken(contracts);

//     stabilityPool = contracts.stabilityPool;

//     borrowerOperations = contracts.borrowerOperations;

//     lqtyToken = LQTYContracts.lqtyToken;

//     communityIssuanceTester = LQTYContracts.communityIssuance;

//     contracts = { ...contracts, lqtyToken };

//     await deploymentHelperLiquity.connectLQTYContracts(LQTYContracts);
//     await deploymentHelperLiquity.connectCoreContracts(
//       contracts,
//       LQTYContracts
//     );
//     await deploymentHelperLiquity.connectLQTYContractsToCore(
//       LQTYContracts,
//       contracts
//     );
//     harpContracts = await deploymentHelperHarp(accounts, contracts);
//     gstringToken = harpContracts.gstringToken;
//     stringToken = harpContracts.stringToken;
//     stringStaking = harpContracts.stringStaking;
//     lqtyTestToken = harpContracts.lqtyTestToken;
//     await stringToken.addMinter(accounts[0].address);
//     await stringToken.mintTo(accounts[0].address, tokens("1000"));
//     await stringToken.mintTo(accounts[1].address, tokens("1000"));
//     await stringToken.mintTo(accounts[2].address, tokens("1000"));
//     await stringToken.mintTo(accounts[3].address, tokens("1000"));
//     await stringToken.revokeOwnership();
//     await gstringToken.revokeOwnership();
//   });

//   describe("Farm attributes on deployment", async () => {
//     it("Sets correct lp address", async () => {
//       const started = await stringStaking.pool();
//       assert.equal(started.lpToken, stringToken.address);
//     });
//     it("Sets correct stringtoken address", async () => {
//       const started = await stringStaking.stringToken();
//       assert.equal(started, stringToken.address);
//     });
//     it("Sets correct rewardperblock", async () => {
//       const reward = await stringStaking.stringPerBlock();
//       assert.equal(reward.toString(), tokens("0.2307692308"));
//     });
//     it("Sets correct registered bool", async () => {
//       const registered = await stringStaking.registered();
//       assert.equal(registered, true);
//     });
//     it("Sets correct creator", async () => {
//       const creator = await stringStaking.creator();
//       assert.equal(creator, accounts[0].address);
//     });
//   });

//   describe("Farm actions", async () => {
//     it("deposit in pool", async () => {
//       let owner = accounts[0];
//       await stringToken
//         .connect(owner)
//         .approve(stringStaking.address, tokens("100"));
//       await stringStaking.connect(owner).deposit(tokens("10"));
//       const userBalance = (
//         await stringToken.balanceOf(owner.address)
//       ).toString();
//       const userFarmBalance = (
//         await stringStaking.userInfo(owner.address)
//       ).amount.toString();
//       const farmBalance = (
//         await stringToken.balanceOf(stringStaking.address)
//       ).toString();

//       const lpSupply = new BigNumber(
//         (await stringStaking.pool()).lpTokenSupply.toString()
//       );

//       const actualPerShare = (
//         await stringStaking.pool()
//       ).accStringPerShare.toString();

//       assert.equal(truncateString(actualPerShare), "0");
//       assert.equal(userFarmBalance, tokens("10"));
//       assert.equal(userBalance, tokens("990"));
//       assert.equal(farmBalance, tokens("10"));
//     });

//     const withdrawCheckROI = async (owner) => {
//       const originalBalance = makeBN(tokens("1000"));

//       await stringStaking.connect(owner).withdraw(tokens("10"));

//       const userBalance = (
//         await stringStaking.userInfo(owner.address)
//       ).amount.toString();

//       const farmLPSupply = (
//         await stringStaking.pool()
//       ).lpTokenSupply.toString();

//       const farmBalance = (
//         await stringToken.balanceOf(stringStaking.address)
//       ).toString();

//       const balance = makeBN(
//         (await stringToken.balanceOf(owner.address)).toString()
//       );

//       const gBal = (await gstringToken.balanceOf(owner.address)).toString();

//       const stringPerBlock = new BigNumber(
//         (await stringStaking.stringPerBlock()).toString()
//       );

//       const actualRewards = balance.sub(originalBalance).toString();

//       const expectedRewards = stringPerBlock
//         .multipliedBy(5)
//         .multipliedBy(11)
//         .toString();

//       assert.equal(actualRewards, expectedRewards);
//       assert.equal(userBalance, tokens("0"));
//       assert.equal(farmBalance, tokens("0"));
//       assert.equal(farmLPSupply, tokens("0"));
//       assert.equal(gBal, tokens("0"));
//     };

//     const claimCheckROI = async (owner) => {
//       const originalBalance = makeBN(tokens("990"));

//       const beforeWith = (
//         await stringToken.balanceOf(owner.address)
//       ).toString();

//       //   console.log("before withdraw", beforeWith);
//       await stringStaking.connect(owner).withdraw(0);

//       const userBalance = (
//         await stringToken.balanceOf(owner.address)
//       ).toString();

//       const farmLPSupply = (
//         await stringStaking.pool()
//       ).lpTokenSupply.toString();

//       const farmBalance = (
//         await stringToken.balanceOf(stringStaking.address)
//       ).toString();

//       const balance = makeBN(
//         (await stringToken.balanceOf(owner.address)).toString()
//       );

//       const stringPerBlock = makeBN(
//         (await stringStaking.stringPerBlock()).toString()
//       );

//       //   console.log(stringPerBlock.multipliedBy(5).toString());

//       //   console.log(fee.toString());

//       const expectedRewards = stringPerBlock.mul(makeBN(5)).mul(makeBN(11));

//       //   console.log(balance.toString());
//       //   console.log(originalBalance.toString());

//       const actualRewards = balance.sub(originalBalance).toString();
//       //   console.log(actualRewards.toString());
//       assert.equal(actualRewards, expectedRewards.toString());
//       assert.equal(
//         userBalance,
//         expectedRewards.add(originalBalance).toString()
//       );
//       assert.equal(farmBalance, tokens("10"));
//       assert.equal(farmLPSupply, tokens("10"));
//     };

//     it("withdraw full from pool", async () => {
//       let owner = accounts[0];
//       await stringToken
//         .connect(owner)
//         .approve(stringStaking.address, tokens("100"));
//       await gstringToken
//         .connect(owner)
//         .approve(stringStaking.address, tokens("100"));
//       await stringStaking.connect(owner).deposit(tokens("10"));
//       const gstringBal = await gstringToken.balanceOf(owner.address);

//       assert.equal(gstringBal.toString(), tokens("10"));
//       //    goes 1 extra
//       await advanceBlock(10);
//       await withdrawCheckROI(owner);
//     });

//     it("claim from pool", async () => {
//       let owner = accounts[0];
//       await stringToken
//         .connect(owner)
//         .approve(stringStaking.address, tokens("100"));
//       await gstringToken
//         .connect(owner)
//         .approve(stringStaking.address, tokens("100"));
//       await stringStaking.connect(owner).deposit(tokens("10"));
//       //    goes 1 extra
//       await advanceBlock(10);
//       await claimCheckROI(owner);
//     });

//     const handleDeposit = async (owner, owner2) => {
//       await stringToken
//         .connect(owner)
//         .approve(stringStaking.address, tokens("100"));
//       await stringToken
//         .connect(owner2)
//         .approve(stringStaking.address, tokens("100"));
//       await gstringToken
//         .connect(owner)
//         .approve(stringStaking.address, tokens("100"));
//       await gstringToken
//         .connect(owner2)
//         .approve(stringStaking.address, tokens("100"));
//       await stringStaking.connect(owner).deposit(tokens("10"));
//       await stringStaking.connect(owner2).deposit(tokens("50"));
//     };

//     it("2 users deposit in pool", async () => {
//       const owner = accounts[0];
//       const owner2 = accounts[1];
//       await handleDeposit(owner, owner2);
//       const userBalance = (
//         await stringToken.balanceOf(owner.address)
//       ).toString();
//       const userBalance2 = (
//         await stringToken.balanceOf(owner2.address)
//       ).toString();
//       const farmBalance = (
//         await stringToken.balanceOf(stringStaking.address)
//       ).toString();
//       const userAccount = await stringStaking.userInfo(owner.address);
//       const userAccount2 = await stringStaking.userInfo(owner2.address);

//       const stringPerBlock = makeBN(
//         (await stringStaking.stringPerBlock()).toString()
//       );

//       const additionalBlock = stringPerBlock.mul(makeBN(5));

//       assert.equal(userAccount.amount.toString(), tokens("10"));
//       assert.equal(userAccount2.amount.toString(), tokens("50"));
//       assert.equal(userBalance, tokens("990"));
//       assert.equal(userBalance2, tokens("950"));
//       assert.equal(farmBalance, makeBN(tokens("60")).add(additionalBlock));
//     });

//     it("2 users deposit in pool 1 then 1 withdraws half", async () => {
//       let owner = accounts[0];
//       let owner2 = accounts[1];
//       await handleDeposit(owner, owner2);

//       let userBalance = (await stringToken.balanceOf(owner.address)).toString();
//       let userBalance3 = (
//         await stringToken.balanceOf(owner2.address)
//       ).toString();
//       let farmBalance = (
//         await stringToken.balanceOf(stringStaking.address)
//       ).toString();
//       let userAccount = await stringStaking.userInfo(owner.address);
//       let userAccount3 = await stringStaking.userInfo(owner2.address);

//       let ownerFee = makeBN(tokens("10")).div(makeBN(1000));
//       let owner2Fee = makeBN(tokens("50")).div(makeBN(1000));

//       let ownerAfterFee = makeBN(tokens("10")).sub(ownerFee);
//       let owner2AfterFee = makeBN(tokens("50")).sub(owner2Fee);

//       const stringPerBlock = makeBN(
//         (await stringStaking.stringPerBlock()).toString()
//       );

//       //   console.log(stringPerBlock.mul(makeBN(5)).toString());

//       let additionalBlock = stringPerBlock.mul(makeBN(5));

//       assert.equal(userAccount.amount, tokens("10"));
//       assert.equal(userAccount3.amount, tokens("50"));
//       assert.equal(userBalance, tokens("990"));
//       assert.equal(userBalance3, tokens("950"));
//       assert.equal(farmBalance, makeBN(tokens("60")).add(additionalBlock));

//       userBalance3 = (await stringToken.balanceOf(owner2.address)).toString();
//       //   console.log(userBalance3);

//       await stringStaking.connect(owner2).withdraw(tokens("25"));

//       const afterBalance = makeBN(tokens("975"));

//       userBalance = (await stringToken.balanceOf(owner.address)).toString();
//       userBalance3 = (await stringToken.balanceOf(owner2.address)).toString();
//       farmBalance = (
//         await stringToken.balanceOf(stringStaking.address)
//       ).toString();
//       userAccount = await stringStaking.userInfo(owner.address);
//       userAccount3 = await stringStaking.userInfo(owner2.address);

//       const withRewards = stringPerBlock
//         .mul(makeBN(5))
//         .mul(makeBN(5))
//         .div(makeBN(6));

//       const remainingReward = stringPerBlock
//         .mul(makeBN(5))
//         .mul(makeBN(2))
//         .sub(withRewards);

//       assert.equal(userAccount.amount.toString(), tokens("10"));
//       assert.equal(userAccount3.amount.toString(), tokens("25"));
//       assert.equal(userBalance, tokens("990"));
//       assert.equal(
//         truncateString(userBalance3),
//         truncateString(makeBN(tokens("975")).add(withRewards).toString())
//       );
//       assert.equal(
//         truncateString(farmBalance),
//         truncateString(makeBN(tokens("35")).add(remainingReward).toString())
//       );
//     });

//     it("2 users deposit in pool 1 then 1 withdraws", async () => {
//       let owner = accounts[0];
//       let owner2 = accounts[1];
//       await handleDeposit(owner, owner2);
//       let userBalance = (await stringToken.balanceOf(owner.address)).toString();
//       let userBalance3 = (
//         await stringToken.balanceOf(owner2.address)
//       ).toString();
//       let farmBalance = (
//         await stringToken.balanceOf(stringStaking.address)
//       ).toString();
//       let userAccount = await stringStaking.userInfo(owner.address);
//       let userAccount3 = await stringStaking.userInfo(owner2.address);

//       const stringPerBlock = makeBN(
//         (await stringStaking.stringPerBlock()).toString()
//       );

//       //   console.log(stringPerBlock.mul(makeBN(5)).toString());

//       let additionalBlock = stringPerBlock.mul(makeBN(5));

//       assert.equal(userAccount.amount, tokens("10"));
//       assert.equal(userAccount3.amount, tokens("50"));
//       assert.equal(userBalance, tokens("990"));
//       assert.equal(userBalance3, tokens("950"));
//       assert.equal(farmBalance, makeBN(tokens("60")).add(additionalBlock));

//       await stringStaking.connect(owner2).withdraw(tokens("50"));

//       userBalance = (await stringToken.balanceOf(owner.address)).toString();
//       userBalance3 = (await stringToken.balanceOf(owner2.address)).toString();
//       farmBalance = (
//         await stringToken.balanceOf(stringStaking.address)
//       ).toString();
//       userAccount = await stringStaking.userInfo(owner.address);
//       userAccount3 = await stringStaking.userInfo(owner2.address);

//       const withRewards = stringPerBlock
//         .mul(makeBN(5))
//         .mul(makeBN(5))
//         .div(makeBN(6));

//       const remainingReward = stringPerBlock
//         .mul(makeBN(5))
//         .mul(makeBN(2))
//         .sub(withRewards);

//       assert.equal(userAccount.amount, tokens("10"));
//       assert.equal(userAccount3.amount, tokens("0"));
//       assert.equal(userBalance, tokens("990"));
//       assert.equal(
//         truncateString(userBalance3),
//         truncateString(makeBN(tokens("1000")).add(withRewards).toString())
//       );
//       assert.equal(
//         truncateString(farmBalance),
//         truncateString(makeBN(tokens("10")).add(remainingReward).toString())
//       );
//     });

//     it("2 users deposit in pool 1 then both withdraws half", async () => {
//       let owner = accounts[0];
//       let owner2 = accounts[1];
//       await handleDeposit(owner, owner2);
//       let userBalance = (await stringToken.balanceOf(owner.address)).toString();
//       let userBalance3 = (
//         await stringToken.balanceOf(owner2.address)
//       ).toString();
//       let farmBalance = (
//         await stringToken.balanceOf(stringStaking.address)
//       ).toString();
//       let userAccount = await stringStaking.userInfo(owner.address);
//       let userAccount3 = await stringStaking.userInfo(owner2.address);

//       const stringPerBlock = makeBN(
//         (await stringStaking.stringPerBlock()).toString()
//       );

//       //   console.log(stringPerBlock.mul(makeBN(5)).toString());

//       let additionalBlock = stringPerBlock.mul(makeBN(5));

//       assert.equal(userAccount.amount, tokens("10"));
//       assert.equal(userAccount3.amount.toString(), tokens("50"));
//       assert.equal(userBalance, tokens("990"));
//       assert.equal(userBalance3, tokens("950"));
//       assert.equal(
//         farmBalance,
//         makeBN(tokens("60")).add(additionalBlock).toString()
//       );

//       await stringStaking.connect(owner2).withdraw(tokens("25"));
//       await stringStaking.connect(owner).withdraw(tokens("5"));

//       userBalance = (await stringToken.balanceOf(owner.address)).toString();
//       userBalance3 = (await stringToken.balanceOf(owner2.address)).toString();
//       farmBalance = (
//         await stringToken.balanceOf(stringStaking.address)
//       ).toString();
//       userAccount = await stringStaking.userInfo(owner.address);
//       userAccount3 = await stringStaking.userInfo(owner2.address);

//       const oneFullBlock = stringPerBlock.mul(makeBN(5));

//       const one6thBlock = stringPerBlock
//         .mul(makeBN(5))
//         .mul(makeBN(1))
//         .div(makeBN(6));

//       const ten35thBlock = stringPerBlock
//         .mul(makeBN(5))
//         .mul(makeBN(10))
//         .div(makeBN(35));

//       const five6thBlock = stringPerBlock
//         .mul(makeBN(5))
//         .mul(makeBN(5))
//         .div(makeBN(6));

//       //   const remainingReward = stringPerBlock
//       //     .mul(makeBN(5))
//       //     .mul(makeBN(2))
//       //     .sub(withRewards);

//       assert.equal(userAccount.amount.toString(), tokens("5"));
//       assert.equal(userAccount3.amount.toString(), tokens("25"));
//       assert.equal(
//         truncateString(userBalance),
//         truncateString(
//           makeBN(tokens("995"))
//             .add(oneFullBlock)
//             .add(one6thBlock)
//             .add(ten35thBlock)
//             .toString()
//         )
//       );
//       assert.equal(
//         truncateString(userBalance3),
//         truncateString(makeBN(tokens("975")).add(five6thBlock).toString())
//       );
//       assert.equal(
//         truncateString(farmBalance),
//         truncateString(
//           makeBN(tokens("30")).add(oneFullBlock.sub(ten35thBlock)).toString()
//         )
//       );
//     });

//     it("2 users deposit in pool then both withdraw ", async () => {
//       let owner = accounts[0];
//       let owner2 = accounts[1];
//       await handleDeposit(owner, owner2);
//       let userBalance = (await stringToken.balanceOf(owner.address)).toString();
//       let userBalance3 = (
//         await stringToken.balanceOf(owner2.address)
//       ).toString();
//       let farmBalance = (
//         await stringToken.balanceOf(stringStaking.address)
//       ).toString();
//       let userAccount = await stringStaking.userInfo(owner.address);
//       let userAccount3 = await stringStaking.userInfo(owner2.address);

//       const stringPerBlock = makeBN(
//         (await stringStaking.stringPerBlock()).toString()
//       );

//       //   console.log(stringPerBlock.mul(makeBN(5)).toString());

//       let additionalBlock = stringPerBlock.mul(makeBN(5));

//       assert.equal(userAccount.amount, tokens("10"));
//       assert.equal(userAccount3.amount, tokens("50"));
//       assert.equal(userBalance, tokens("990"));
//       assert.equal(userBalance3, tokens("950"));
//       assert.equal(farmBalance, makeBN(tokens("60")).add(additionalBlock));

//       await stringStaking.connect(owner).withdraw(tokens("10"));
//       await stringStaking.connect(owner2).withdraw(tokens("50"));

//       userBalance = (await stringToken.balanceOf(owner.address)).toString();
//       userBalance3 = (await stringToken.balanceOf(owner2.address)).toString();
//       farmBalance = (
//         await stringToken.balanceOf(stringStaking.address)
//       ).toString();
//       const farmLPSupply = (
//         await stringStaking.pool()
//       ).lpTokenSupply.toString();
//       userAccount = await stringStaking.userInfo(owner.address);
//       userAccount3 = await stringStaking.userInfo(owner2.address);

//       const oneFullBlock = stringPerBlock.mul(makeBN(5));

//       const one6thBlock = stringPerBlock
//         .mul(makeBN(5))
//         .mul(makeBN(1))
//         .div(makeBN(6));

//       const ten35thBlock = stringPerBlock
//         .mul(makeBN(5))
//         .mul(makeBN(10))
//         .div(makeBN(35));

//       const five6thBlock = stringPerBlock
//         .mul(makeBN(5))
//         .mul(makeBN(5))
//         .div(makeBN(6));

//       assert.equal(userAccount.amount, tokens("0"));
//       assert.equal(userAccount3.amount, tokens("0"));
//       assert.equal(
//         truncateString(userBalance),
//         truncateString(
//           makeBN(tokens("1000"))
//             .add(makeBN(oneFullBlock))
//             .add(one6thBlock)
//             .toString()
//         )
//       );
//       assert.equal(
//         truncateString(userBalance3),
//         truncateString(
//           makeBN(tokens("1000")).add(oneFullBlock).add(five6thBlock).toString()
//         )
//       );
//       assert.equal(farmLPSupply, tokens("0"));
//     });

//     it("2 users deposit in pool 1 overwithdraws ", async () => {
//       let owner = accounts[0];
//       let owner2 = accounts[1];
//       await handleDeposit(owner, owner2);
//       let userBalance = (await stringToken.balanceOf(owner.address)).toString();
//       let userBalance3 = (
//         await stringToken.balanceOf(owner2.address)
//       ).toString();
//       let farmBalance = (
//         await stringToken.balanceOf(stringStaking.address)
//       ).toString();
//       let userAccount = await stringStaking.userInfo(owner.address);
//       let userAccount3 = await stringStaking.userInfo(owner2.address);

//       const stringPerBlock = makeBN(
//         (await stringStaking.stringPerBlock()).toString()
//       );

//       //   console.log(stringPerBlock.mul(makeBN(5)).toString());

//       let additionalBlock = stringPerBlock.mul(makeBN(5));

//       assert.equal(userAccount.amount, tokens("10"));
//       assert.equal(userAccount3.amount, tokens("50"));
//       assert.equal(userBalance, tokens("990"));
//       assert.equal(userBalance3, tokens("950"));
//       assert.equal(farmBalance, makeBN(tokens("60")).add(additionalBlock));

//       try {
//         await stringStaking.connect(owner).withdraw(tokens("50"));
//       } catch (err) {
//         assert(
//           err.message.indexOf("revert") >= 0,
//           "error message must contain revert"
//         );
//       }
//     });

//     it("rewards for 2 depositers", async () => {
//       let owner = accounts[0];
//       let owner2 = accounts[1];
//       //    causes 1 full block reward to go to first depositer
//       await handleDeposit(owner, owner2);
//       const beforeUserAcc = await stringStaking.userInfo(owner.address);
//       const beforeUserAcc2 = await stringStaking.userInfo(owner2.address);
//       const stringPerBlock = await stringStaking.stringPerBlock();
//       //   11 blocks
//       await advanceBlock(10);
//       let totalRewards = await stringToken.balanceOf(stringStaking.address);
//       //    12 blocks
//       await stringStaking.connect(owner).withdraw(tokens("10"));
//       totalRewards = await stringToken.balanceOf(stringStaking.address);
//       //    13 blocks
//       await stringStaking.connect(owner2).withdraw(tokens("50"));
//       totalRewards = await stringToken.balanceOf(stringStaking.address);
//       const rewards = makeBN(
//         (await stringToken.balanceOf(owner.address)).toString()
//       ).sub(makeBN(tokens("1000")));
//       const rewards2 = makeBN(
//         (await stringToken.balanceOf(owner2.address)).toString()
//       ).sub(makeBN(tokens("1000")));
//       const newBlocks = 13;
//       const num = new BigNumber(stringPerBlock.toString());
//       const temp = new BigNumber(stringPerBlock.toString());
//       console.log(`String Per Block:${stringPerBlock.toString()}`);
//       const expectedRewards = num.times(newBlocks).times(5);

//       const owner1Balance = num
//         .times(11)
//         .times(5)
//         .times(1 / 6)
//         .plus(temp.times(5));
//       const owner2Balance = num
//         .times(11)
//         .times(5)
//         .times(5 / 6)
//         .plus(temp.times(5));
//       console.log(`total rewards expected:${expectedRewards.toString()}`);
//       console.log(`total rewards actual:${totalRewards.toString()}`);
//       console.log(`owner share of rewards: ${owner1Balance.toString()}`);
//       console.log(`owner2 share of rewards: ${owner2Balance.toString()}`);
//       console.log(`actual rewards: ${rewards.toString()}`);
//       console.log(`actual rewards2: ${rewards2.toString()}`);
//       assert.equal(
//         truncateString(rewards.toString()),
//         truncateString(owner1Balance.toString())
//       );
//       assert.equal(
//         truncateString(rewards2.toString()),
//         truncateString(owner2Balance.toString())
//       );
//     });

//     it("Check Boosted logic", async () => {
//       let owner = accounts[0];
//       let owner2 = accounts[1];
//       await handleDeposit(owner, owner2);

//       await advanceBlock(300);
//       await stringStaking.connect(owner).withdraw(tokens("10"));

//       let isBoosted = await stringStaking.isBoosted();
//       assert.equal(isBoosted, false);
//     });

//     it("LQTY rewards check", async () => {
//       const owner = accounts[0];
//       const owner2 = accounts[1];
//       const owner3 = accounts[2];
//       await handleDeposit(owner, owner2);
//       await stringToken
//         .connect(owner3)
//         .approve(stringStaking.address, tokens("100"));
//       await gstringToken
//         .connect(owner3)
//         .approve(stringStaking.address, tokens("100"));

//       const owner3bal = await stringToken.balanceOf(owner3.address);

//       // console.log(owner3bal.toString());

//       await stringStaking.connect(owner3).deposit(tokens("40"));

//       await lqtyTestToken.mintTo(stringStaking.address, tokens("1000"));

//       await advanceBlock(1);
//       const pending = await stringStaking.pendingLQTY(owner.address);

//       console.log("pending", pending);
//       console.log("pending", pending);
//       console.log("pending", pending);
//       console.log("pending", pending);

//       assert.equal(pending.toString(), tokens("100"));

//       await stringStaking.connect(owner).withdraw(tokens("0"));

//       await advanceBlock(1);

//       await stringStaking.connect(owner).withdraw(tokens("0"));

//       await advanceBlock(1);

//       await stringStaking.connect(owner).withdraw(tokens("0"));

//       await advanceBlock(1);

//       await stringStaking.connect(owner3).withdraw(tokens("0"));

//       await advanceBlock(1);

//       await stringStaking.connect(owner3).withdraw(tokens("0"));

//       await advanceBlock(1);

//       await stringStaking.connect(owner3).withdraw(tokens("0"));

//       await advanceBlock(1);

//       await stringStaking.connect(owner2).withdraw(tokens("0"));

//       await lqtyTestToken.mintTo(stringStaking.address, tokens("1000"));

//       await advanceBlock(1);

//       await stringStaking.connect(owner2).withdraw(tokens("0"));

//       await advanceBlock(4);

//       await stringStaking.connect(owner2).withdraw(tokens("0"));

//       await advanceBlock(4);

//       await stringStaking.connect(owner2).withdraw(tokens("0"));

//       await advanceBlock(4);

//       await stringStaking.connect(owner2).withdraw(tokens("0"));

//       await stringStaking.connect(owner2).deposit(tokens("10"));

//       await advanceBlock(4);

//       await stringStaking.connect(owner2).withdraw(tokens("0"));

//       await stringStaking.connect(owner).withdraw(tokens("0"));

//       const totalSupply = await lqtyTestToken.totalSupply();

//       // console.log("totalsupply", totalSupply.toString());
//       const ownerRewards = await lqtyTestToken.balanceOf(owner.address);
//       const owner3Rewards = await lqtyTestToken.balanceOf(owner3.address);
//       const owner2Rewards = await lqtyTestToken.balanceOf(owner2.address);

//       assert.equal(ownerRewards.toString(), tokens("200"));
//       assert.equal(owner3Rewards.toString(), tokens("400"));
//       assert.equal(owner2Rewards.toString(), tokens("1000"));

//       console.log(owner3Rewards.toString());
//     });
//   });
// });
