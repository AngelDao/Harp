/* eslint-disable jest/valid-describe */
/* eslint-disable no-undef */
const { assert, expect } = require("chai");
const deploymentHelperLiquity = require("../utils/deploymentHelperLiquity");
const deploymentHelperHarp = require("../utils/deploymentHelperHarp");
const { ethers } = require("hardhat");
require("chai").use(require("chai-as-promised")).should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("gSTRING Token Tests", () => {
  let contracts, accounts;

  beforeEach(async () => {
    contracts = await deploymentHelperLiquity.deployLiquityCore();
    debugger;
    console.log(contracts);
    accounts = await ethers.getSigners();
    console.log(accounts);
    await deploymentHelperHarp(accounts, contracts);
  });

  describe("test deployment", async () => {
    it("test", async () => {
      console.log(contracts);
    });
  });
});
