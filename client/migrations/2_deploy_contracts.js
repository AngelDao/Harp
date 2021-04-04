// HARP
const StringToken = artifacts.require("StringToken");
const gStringToken = artifacts.require("gStringToken");
const TokenVesting = artifacts.require("TokenVesting");
const LatestFarm = artifacts.require("LatestFarm");
// const LUSDLP = artifacts.require("LUSDLPToken");
// const ETHLP = artifacts.require("ETHLPToken");
// const LQTYToken = artifacts.require("LQTYToken");
const StringStaking = artifacts.require("StringStaking");
// const LUSDToken = artifacts.require("LUSDToken.sol");
const StabilityFactory = artifacts.require("StabilityFactory.sol");
// const UniFactory = artifacts.require("IUniswapv2Factory.sol");
const { addresses } = require("../src/utils/handleContracts/addresses");

module.exports = async function (deployer, network, accounts) {
  const deploy = "kovan";

  // HARP
  // 2nd Ganache
  // Token Contract
  const HarpDAOAddress = "0x0cbde7d648C1F51253d53ca1dB099030Fc35490a";
  const owner = accounts[1];
  console.log(owner);

  let lusdToken, lqtyToken, stabilityPool;

  if (deploy === "kovan") {
    lusdToken = addresses.kovan.lusdToken;
    lqtyToken = addresses.kovan.lqtyToken;
    stabilityPool = addresses.kovan.stabilityPool;
  } else if (deploy === "ganache") {
    stabilityPool = addresses.kovan.stabilityPool;
    // lusdToken = await LUSDToken.deployed();
    // lqtyToken = await LQTYToken.deployed();
  }else if( deploy === "rinkeby") {
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

  await stringToken.addVestingAddress(vestingAddress, { from: owner });

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

  await deployer.deploy(LatestFarm, stringToken.address, 100);

  const farm = await LatestFarm.deployed();
  const stringStaking = await StringStaking.deployed();
  await stringStaking.registerIt({ from: owner });

  await gstringToken.addVestingAddress(stringStaking.address, { from: owner });
  await stringToken.addVestingAddress(stringStaking.address, { from: owner });
  await stringToken.addVestingAddress(farm.address, { from: owner });

  await deployer.deploy(
    StabilityFactory,
    stringStaking.address,
    lusdToken,
    lqtyToken,
    stringToken.address,
    stabilityPool
  );

  const sf = await StabilityFactory.deployed();

  await stringToken.addVestingAddress(sf.address, { from: owner });
};
