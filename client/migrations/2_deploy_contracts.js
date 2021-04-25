// HARP
const StringToken = artifacts.require("StringToken");
const gStringToken = artifacts.require("gStringToken");
const TokenVesting = artifacts.require("TokenVesting");
const Farm = artifacts.require("Farm");
// const LUSDLP = artifacts.require("LUSDLPToken");
// const ETHLP = artifacts.require("ETHLPToken");
// const LQTYToken = artifacts.require("LQTYToken");
const StringStaking = artifacts.require("StringStaking");
// const LUSDToken = artifacts.require("LUSDToken.sol");
const StabilityFactory = artifacts.require("StabilityFactory.sol");
// const UniFactory = artifacts.require("IUniswapv2Factory.sol");
const { addresses } = require("../src/utils/handleContracts/addresses");

module.exports = async function (deployer, network, accounts) {
  const chain = process.argv[process.argv.length - 1];

  // HARP
  // 2nd Ganache
  // Token Contract
  const HarpDAOAddress = "0x0cbde7d648C1F51253d53ca1dB099030Fc35490a";
  const owner = accounts[1];

  let lusdToken, lqtyToken, stabilityPool;

  if (chain === "kovan") {
    lusdToken = addresses.kovan.lusdToken;
    lqtyToken = addresses.kovan.lqtyToken;
    stabilityPool = addresses.kovan.stabilityPool;
  } else if (chain === "ganache") {
  } else if (chain === "rinkeby") {
    lusdToken = addresses.rinkeby.lusdToken;
    lqtyToken = addresses.rinkeby.lqtyToken;
    stabilityPool = addresses.rinkeby.stabilityPool;
  }
  await deployer.deploy(StringToken, "String", "STRING", HarpDAOAddress, owner);
  const stringToken = await StringToken.deployed();

  const AngelDAOAddress = accounts[2];
  const years = 365 * 2;
  await deployer.deploy(
    TokenVesting,
    AngelDAOAddress,
    years,
    stringToken.address
  );
  const tokenVesting = await TokenVesting.deployed();

  const vestingAddress = tokenVesting.address;

  await stringToken.addMinter(vestingAddress, { from: owner });

  await deployer.deploy(gStringToken, owner);
  const gstringToken = await gStringToken.deployed();
  await deployer.deploy(
    StringStaking,
    stringToken.address,
    100,
    lqtyToken,
    gstringToken.address,
    stabilityPool
  );

  await deployer.deploy(Farm, stringToken.address, 100);

  const farm = await Farm.deployed();
  const stringStaking = await StringStaking.deployed();
  await stringStaking.registerIt({ from: owner });

  await gstringToken.addMinter(stringStaking.address, { from: owner });
  await stringToken.addMinter(stringStaking.address, { from: owner });
  await stringToken.addMinter(farm.address, { from: owner });

  await deployer.deploy(
    StabilityFactory,
    stringStaking.address,
    lusdToken,
    lqtyToken,
    stringToken.address,
    stabilityPool,
    100
  );

  const sf = await StabilityFactory.deployed();

  await stringToken.addMinter(sf.address, { from: owner });
};
