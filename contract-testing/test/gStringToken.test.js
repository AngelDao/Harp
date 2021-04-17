/* eslint-disable jest/valid-describe */
/* eslint-disable no-undef */
//const { assert, expect } = require("chai");
//const deploymentHelperLiquity = require("../utils/deploymentHelperLiquity");
//const deploymentHelperHarp = require("../utils/deploymentHelperHarp");
//const { ethers } = require("hardhat");
//require("chai").use(require("chai-as-promised")).should();
//const StabilityPool = artifacts.require("./StabilityPool.sol");
//
//function tokens(n) {
//  return web3.utils.toWei(n, "ether");
//}
//
//contract("gSTRING Token Tests", () => {
//  let contracts, accounts, harpContracts, gstringToken;
//
//  beforeEach(async () => {
//    accounts = await ethers.getSigners();
//    contracts = await deploymentHelperLiquity.deployLiquityCore();
//    const LQTYContracts = await deploymentHelperLiquity.deployLQTYTesterContractsHardhat(
//      accounts[1].address,
//      accounts[2].address,
//      accounts[3].address
//    );
//    contracts.stabilityPool = await StabilityPool.new();
//    contracts = await deploymentHelperLiquity.deployLUSDToken(contracts);
//
//    stabilityPool = contracts.stabilityPool;
//    borrowerOperations = contracts.borrowerOperations;
//
//    lqtyToken = LQTYContracts.lqtyToken;
//    communityIssuanceTester = LQTYContracts.communityIssuance;
//
//    contracts = { ...contracts, lqtyToken };
//
//    await deploymentHelperLiquity.connectLQTYContracts(LQTYContracts);
//    await deploymentHelperLiquity.connectCoreContracts(
//      contracts,
//      LQTYContracts
//    );
//    await deploymentHelperLiquity.connectLQTYContractsToCore(
//      LQTYContracts,
//      contracts
//    );
//    harpContracts = await deploymentHelperHarp(accounts, contracts);
//    gstringToken = harpContracts.gstringToken;
//    gstringToken.addMinter(accounts[0].address, { from: accounts[0].address });
//    await gstringToken.mintTo(accounts[1].address, tokens("1000"), {
//      from: accounts[0].address,
//    });
//    await gstringToken.mintTo(accounts[2].address, tokens("1000"), {
//      from: accounts[0].address,
//    });
//    await gstringToken.mintTo(accounts[0].address, tokens("1000"), {
//      from: accounts[0].address,
//    });
//  });
//
//  describe("Token Attributes Check On Deployment", async () => {
//    it("Sets correct Name upon deployment", async () => {
//      let name = await gstringToken.name();
//      assert.equal(name, "Goverance String Token");
//    });
//    it("Sets correct Symbol upon deployment", async () => {
//      let symbol = await gstringToken.symbol();
//      assert.equal(symbol, "gSTRING");
//    });
//    it("Sets correct Decimal upon deployment", async () => {
//      let decimals = await gstringToken.decimals();
//      assert.equal(decimals, 18);
//    });
//  });
//
//  describe("Token Contract actions", async () => {
//    it("not allows non vesting contract to mint tokens", async () => {
//      try {
//        await gstringToken.mintTo(accounts[1].address, tokens("10"));
//      } catch (err) {
//        assert(
//          err.message.indexOf("revert") >= 0,
//          "Sender not a verified Minter"
//        );
//      }
//    });
//
//    it("transfer tokens success", async () => {
//      gstringToken = await gstringToken.connect(accounts[1]);
//
//      await gstringToken.transfer(accounts[0].address, tokens("10"));
//
//      const recieverBalance = (
//        await gstringToken.balanceOf(accounts[0].address)
//      ).toString();
//      const senderBalance = (
//        await gstringToken.balanceOf(accounts[1].address)
//      ).toString();
//
//      assert.equal(recieverBalance, tokens("1010"));
//      assert.equal(senderBalance, tokens("990"));
//    });
//
//    it("transfer tokens fail send more than have", async () => {
//      try {
//        await gstringToken.transfer(accounts[1].address, tokens("20000000000"));
//      } catch (err) {
//        assert(
//          err.message.indexOf("revert") >= 0,
//          "error message must contain revert"
//        );
//      }
//    });
//
//    it("Transfer Event triggerd", async () => {
//      const tx = await gstringToken.transfer(accounts[1].address, tokens("10"));
//      const receipt = await tx.wait();
//
//      assert.equal(receipt.events.length, 1, "test that one event emitted");
//      assert.equal(
//        receipt.events[0].event,
//        "Transfer",
//        "test that Transfer event was specifically emitted"
//      );
//      assert.equal(
//        receipt.events[0].args.from,
//        accounts[0].address,
//        "test that the correct from was used"
//      );
//      assert.equal(
//        receipt.events[0].args.to,
//        accounts[1].address,
//        "test that the correct to address was used"
//      );
//      assert.equal(
//        receipt.events[0].args.value,
//        tokens("10"),
//        "test value of tx"
//      );
//    });
//
//    it("approves tokens for delegated token transfer", async () => {
//      await gstringToken
//        .connect(accounts[1])
//        .approve(accounts[0].address, tokens("1000"));
//      const allowance = (
//        await gstringToken.allowance(accounts[1].address, accounts[0].address)
//      ).toString();
//      assert.equal(allowance, tokens("1000"));
//    });
//
//    it("Approval event triggered", async () => {
//      const tx = await gstringToken.approve(
//        accounts[1].address,
//        tokens("1000")
//      );
//
//      const receipt = await tx.wait();
//
//      assert.equal(receipt.events.length, 1, "test that one event emitted");
//      assert.equal(
//        receipt.events[0].event,
//        "Approval",
//        "test that Approval event was specifically emitted"
//      );
//      assert.equal(
//        receipt.events[0].args.owner,
//        accounts[0].address,
//        "test that the correct owner address was used"
//      );
//      assert.equal(
//        receipt.events[0].args.spender,
//        accounts[1].address,
//        "test that the correct spender address was used"
//      );
//      assert.equal(
//        receipt.events[0].args.value,
//        tokens("1000"),
//        "test the value of value allowed"
//      );
//    });
//
//    it("handle burn from", async () => {
//      const burner = accounts[1].address;
//      const burned = accounts[0].address;
//
//      await gstringToken.connect(accounts[0]).approve(burner, tokens("100"));
//      await gstringToken.connect(accounts[1]).burnFrom(burned, tokens("50"));
//
//      const burnedBalance = (await gstringToken.balanceOf(burned)).toString();
//
//      assert.equal(burnedBalance, tokens("950"));
//    });
//
//    it("handle transfer from ", async () => {
//      const from = accounts[1].address;
//      const spender = accounts[0].address;
//      const to = accounts[2].address;
//
//      await gstringToken.connect(accounts[1]).approve(spender, tokens("100"));
//      const tx = await gstringToken
//        .connect(accounts[0])
//        .transferFrom(from, to, tokens("10"));
//
//      const receipt = await tx.wait();
//
//      const fromBalance = (await gstringToken.balanceOf(from)).toString();
//      const toBalance = (await gstringToken.balanceOf(to)).toString();
//
//      const newAllowance = (
//        await gstringToken.allowance(from, spender)
//      ).toString();
//
//      assert.equal(newAllowance, tokens("90"));
//      assert.equal(fromBalance, tokens("990"));
//      assert.equal(toBalance, tokens("1010"));
//      assert.equal(receipt.events.length, 2, "test that one event emitted");
//      assert.equal(
//        receipt.events[0].event,
//        "Transfer",
//        "test that Transfer event was specifically emitted"
//      );
//      assert.equal(
//        receipt.events[0].args.from,
//        from,
//        "test that the correct from was used"
//      );
//      assert.equal(
//        receipt.events[0].args.to,
//        to,
//        "test that the correct to address was used"
//      );
//      assert.equal(
//        receipt.events[0].args.value,
//        tokens("10"),
//        "test value of tx"
//      );
//    });
//  });
//});
//
