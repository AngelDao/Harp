const StringToken = artifacts.require("StringToken");
const gStringToken = artifacts.require("gStringToken");
const TokenVesting = artifacts.require("TokenVesting");
const Farm = artifacts.require("Farm");
const StringStaking = artifacts.require("StringStaking");
const StabilityFactory = artifacts.require("StabilityFactory.sol");

const deployHarp = async (addresses, HarpDAO, AngelDAO, liquity) => {
  // user addresses
  const owner = addresses[0];

  // DAO Adresses
  const AngelDAO = "0x3Af2d668Afd7eF2B94b0862aE759712c067DFa4c";
  const HarpDAO = "0xdF7054884fCb9A8681490A1D977fbD295C02cCFF";

  // Liquity Addresses
  const { stabilityPool, lqtyToken, lusdToken } = liquity;

  // Harp contracts
  let stringToken = await ethers.getContractFactory("StringToken");
  let gstringToken = await ethers.getContractFactory("gStringToken");
  let tokenVesting = await ethers.getContractFactory("TokenVesting");
  let farm = await ethers.getContractFactory("Farm");
  let stringStaking = await ethers.getContractFactory("StringStaking");
  let stabilityFactory = await ethers.getContractFactory("StabilityFactory");

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
  tokenVesting = await tokenVesting.deploy(
    AngelDAO,
    365,
    stringToken.addresses
  );

  // deploy Farm contract
  await farm.deploy(stringToken.address, 100, { from: owner });

  // deploy StringStaking contract
  await stringStaking.deploy(
    stringToken.address,
    100,
    lqtyToken,
    gstringToken.address,
    stabilityPool
  );

  // deploy StabilityFactory contract
  await stabilityFactory.deploy(
    stringStaking.address,
    lusdToken,
    lqtyToken,
    stringToken.address,
    stabilityPool
  );

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
};
