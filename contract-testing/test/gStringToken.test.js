/* eslint-disable jest/valid-describe */
/* eslint-disable no-undef */
const { assert, expect } = require("chai");
const deploymentHelperLiquity = require("../utils/deploymentHelperLiquity");
const deploymentHelperHarp = require("../utils/deploymentHelperHarp");
const { ethers } = require("hardhat");
require("chai").use(require("chai-as-promised")).should();
const StabilityPool = artifacts.require("./StabilityPool.sol");

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("gSTRING Token Tests", () => {
  let contracts, accounts;

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
    console.log("contracts");
    console.log("contracts");
    console.log("contracts");
    console.log("contracts");
    console.log("accounts");
    console.log("accounts");
    console.log("accounts");
    console.log("accounts");
    await deploymentHelperHarp(accounts, contracts);
  });

  describe("test deployment", async () => {
    it("test", async () => {
      console.log(contracts);
    });
  });
});
