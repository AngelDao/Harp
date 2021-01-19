const { assert } = require("chai");
const timeMachine = require("ganache-time-traveler");

const StringToken = artifacts.require("StringToken");
const LUSDLP = artifacts.require("LUSDLPToken");
const ETHLP = artifacts.require("ETHLPToken");
const Farm = artifacts.require("Farm");

const SECOND = 1000;
const HOUR = 60 * 60;
const DAY = 24 * HOUR;

require("chai").use(require("chai-as-promised")).should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("TokenVesting Tests", (accounts) => {
  let stringToken, farm, ethLPToken, lusdLPToken, yearsToLockUp, clock;
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
    const ownerToken = accounts[3];
    stringToken = await StringToken.new(
      "ozString",
      "ozSTRING",
      HarpDAOAddress,
      ownerToken
    );

    ethLPToken = await ETHLP.new(owner);
    lusdLPToken = await LUSDLP.new(owner);

    farm = await Farm.new(
      ETHLP.address,
      LUSDLP.address,
      stringToken.address,
      358974359
    );
  });

  describe("Farm attributes on deployment", async () => {
    // it();
  });

  describe("Farm actions", async () => {});
});
