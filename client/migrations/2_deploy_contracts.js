const StringToken = artifacts.require("StringToken");
const gStringToken = artifacts.require("gStringToken");
const TokenVesting = artifacts.require("TokenVesting");
const Farm = artifacts.require("Farm");
const StringStaking = artifacts.require("StringStaking");
const StabilityFactory = artifacts.require("StabilityFactory.sol");
const { addresses } = require("../src/utils/handleContracts/addresses");

module.exports = async function (deployer, network, accounts) {
  // User Addresses
  let owner = accounts[0];

  // DAO Adresses
  const AngelDAO = "0x8Ae4aA31C8D4cbBCdeF62fA2e301145bfd77F06B";
  const HarpDAO = "0xf46A8Fb9799A95f564444f9FD92B73024C3A24Bf";

  // Chain
  const chain = process.argv[process.argv.length - 1];

  // Liquity Adressses
  let lusdToken, lqtyToken, stabilityPool;
  if (chain === "kovan") {
    owner = deployer.networks.kovan.from;
    lusdToken = addresses.kovan.lusdToken;
    lqtyToken = addresses.kovan.lqtyToken;
    stabilityPool = addresses.kovan.stabilityPool;
  } else if (chain === "ganache") {
  } else if (chain === "mainnet") {
  } else if (chain === "rinkeby") {
    owner = deployer.networks.rinkeby.from;
    lusdToken = addresses.rinkeby.lusdToken;
    lqtyToken = addresses.rinkeby.lqtyToken;
    stabilityPool = addresses.rinkeby.stabilityPool;
  }

  // Config vars
  const years = 365 * 2;
  const bbCount = 390000;

  // Deploy STRING Token
  await deployer.deploy(StringToken, "STRING Token", "STRING", HarpDAO, owner);
  const stringToken = await StringToken.deployed();

  // Deploy TokenVesting
  await deployer.deploy(TokenVesting, AngelDAO, years, stringToken.address);
  const tokenVesting = await TokenVesting.deployed();

  // Deploy gSTRING Token
  await deployer.deploy(gStringToken, owner);
  const gstringToken = await gStringToken.deployed();

  //  Deploy StringStaking
  await deployer.deploy(
    StringStaking,
    stringToken.address,
    bbCount,
    lqtyToken,
    gstringToken.address,
    stabilityPool
  );
  const stringStaking = await StringStaking.deployed();

  // Deploy Farm
  await deployer.deploy(Farm, stringToken.address, bbCount);
  const farm = await Farm.deployed();

  // Deploy StabilityFactory
  await deployer.deploy(
    StabilityFactory,
    stringStaking.address,
    lusdToken,
    lqtyToken,
    stringToken.address,
    stabilityPool,
    bbCount
  );
  const sf = await StabilityFactory.deployed();

  // ALLOW VERIFIED MINTERS

  // TokenVesting can mint STRING
  await stringToken.addMinter(tokenVesting.address, { from: owner });

  // StringStaking can mint STRING
  await stringToken.addMinter(stringStaking.address, { from: owner });

  // StringStaking can mint and burn gSTRING
  await gstringToken.addMinter(stringStaking.address, { from: owner });

  // Farm can mint STRING
  await stringToken.addMinter(farm.address, { from: owner });

  // StabilityFactory can mint STRING
  await stringToken.addMinter(sf.address, { from: owner });

  // Register StringStaking as the frontend address
  await stringStaking.registerIt({ from: owner });

  // Revoke ownership for gSTRING and STRING
  await stringToken.revokeOwnership({ from: owner });
  await gstringToken.revokeOwnership({ from: owner });
};
