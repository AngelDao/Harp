const StringToken = artifacts.require("StringToken");
const gStringToken = artifacts.require("gStringToken");
const TokenVesting = artifacts.require("TokenVesting");
const Farm = artifacts.require("Farm");
const StringStaking = artifacts.require("StringStaking");
const StabilityFactory = artifacts.require("StabilityFactory.sol");

const deployHarp = async (addresses, liquity) => {
  // user addresses
  const owner = addresses[0].address;
  const owner2 = addresses[1].address;

  // DAO Adresses
  const AngelDAO = "0x3Af2d668Afd7eF2B94b0862aE759712c067DFa4c";
  const HarpDAO = "0xdF7054884fCb9A8681490A1D977fbD295C02cCFF";

  // Liquity Addresses
  const stabilityPool = liquity.stabilityPool.address;
  const lqtyToken = liquity.lqtyToken.address;
  const lusdToken = liquity.lusdToken.address;

  // TEST Contract

  let testSend = await ethers.getContractFactory("ETHSendContract");

  // Harp contracts
  let stringToken = await ethers.getContractFactory("StringToken");
  let gstringToken = await ethers.getContractFactory("gStringToken");
  let tokenVesting = await ethers.getContractFactory("TokenVesting");
  let farm = await ethers.getContractFactory("Farm");
  let stringStaking = await ethers.getContractFactory("StringStaking");
  let stabilityFactory = await ethers.getContractFactory("StabilityFactory");
  let lqtyTestToken = await ethers.getContractFactory("LQTYTokenTest");

  testSend = await testSend.deploy();

  // deploy LQTY contract
  lqtyTestToken = await lqtyTestToken.deploy(owner, owner2);

  // deploy STRING contract
  stringToken = await stringToken.deploy(
    "STRING Token",
    "STRING",
    HarpDAO,
    owner
  );

  // deploy gSTRING contract
  gstringToken = await gstringToken.deploy(owner);

  // deploy TokenVesting contract
  tokenVesting = await tokenVesting.deploy(AngelDAO, 365, stringToken.address);

  // deploy Farm contract
  farm = await farm.deploy(stringToken.address, 100);

  // deploy StringStaking contract
  stringStaking = await stringStaking.deploy(
    stringToken.address,
    200,
    lqtyTestToken.address,
    gstringToken.address,
    stabilityPool
  );

  // deploy StabilityFactory contract
  stabilityFactory = await stabilityFactory.deploy(
    stringStaking.address,
    lusdToken,
    lqtyToken,
    stringToken.address,
    stabilityPool,
    200,
    testSend.address
  );

  // add TokenVesting as a verified STRING minter
  await stringToken.addMinter(tokenVesting.address);

  // add StabilityFactory as a verified STRING minter
  await stringToken.addMinter(stabilityFactory.address);

  // add Farm as a verified STRING minter
  await stringToken.addMinter(farm.address);

  // add StringStaking as a verified STRING minter
  await stringToken.addMinter(stringStaking.address);

  // add StringStaking as a verified gSTRING minter
  await gstringToken.addMinter(stringStaking.address);

  // register the front end
  await stringStaking.registerIt({ from: owner });

  return {
    lqtyTestToken,
    stringStaking,
    stringToken,
    gstringToken,
    tokenVesting,
    farm,
    stabilityFactory,
    testSend,
  };
};

module.exports = deployHarp;
