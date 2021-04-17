const StringToken = artifacts.require("StringToken");
const gStringToken = artifacts.require("gStringToken");
const TokenVesting = artifacts.require("TokenVesting");
const Farm = artifacts.require("Farm");
const StringStaking = artifacts.require("StringStaking");
const StabilityFactory = artifacts.require("StabilityFactory.sol");

const deployHarp = async (addresses, liquity) => {
  // user addresses
  const owner = addresses[0].address;

  // DAO Adresses
  const AngelDAO = "0x3Af2d668Afd7eF2B94b0862aE759712c067DFa4c";
  const HarpDAO = "0xdF7054884fCb9A8681490A1D977fbD295C02cCFF";

  // Liquity Addresses
  const stabilityPool = liquity.stabilityPool.address;
  const lqtyToken = liquity.lqtyToken.address;
  const lusdToken = liquity.lusdToken.address;

  // Harp contracts
  let stringToken = await ethers.getContractFactory("StringToken");
  let gstringToken = await ethers.getContractFactory("gStringToken");
  let tokenVesting = await ethers.getContractFactory("TokenVesting");
  let farm = await ethers.getContractFactory("Farm");
  let stringStaking = await ethers.getContractFactory("StringStaking");
  let stabilityFactory = await ethers.getContractFactory("StabilityFactory");

  console.log("get factories");
  // deploy STRING contract
  stringToken = await stringToken.deploy(
    "STRING Token",
    "STRING",
    HarpDAO,
    owner
  );
  console.log("deploy string");

  // deploy gSTRING contract
  gstringToken = await gstringToken.deploy(owner);
  console.log("deploy gstring");

  // deploy TokenVesting contract
  tokenVesting = await tokenVesting.deploy(AngelDAO, 365, stringToken.address);
  console.log("deploy tokenvesting");

  // deploy Farm contract
  farm = await farm.deploy(stringToken.address, 100);
  console.log("deploy farm");

  // deploy StringStaking contract
  stringStaking = await stringStaking.deploy(
    stringToken.address,
    100,
    lqtyToken,
    gstringToken.address,
    stabilityPool
  );
  console.log("deploy stringstaking");

  // deploy StabilityFactory contract
  stabilityFactory = await stabilityFactory.deploy(
    stringStaking.address,
    lusdToken,
    lqtyToken,
    stringToken.address,
    stabilityPool
  );
  console.log("deploy stability");

  // add TokenVesting as a verified STRING minter
  await stringToken.addMinter(tokenVesting.address, { from: owner });

  // add StabilityFactory as a verified STRING minter
  await stringToken.addMinter(stabilityFactory.address, { from: owner });

  // add Farm as a verified STRING minter
  await stringToken.addMinter(farm.address, { from: owner });

  // add StringStaking as a verified STRING minter
  await stringToken.addMinter(stabilityFactory.address, { from: owner });

  // add StringStaking as a verified gSTRING minter
  await gstringToken.addMinter(farm.address, { from: owner });

  // register the front end
  await stringStaking.registerIt({ from: owner });

  console.log("connect to blockchain");
  return {
    stringStaking,
    stringToken,
    gstringToken,
    tokenVesting,
    farm,
    stabilityFactory,
  };
};

module.exports = deployHarp;
