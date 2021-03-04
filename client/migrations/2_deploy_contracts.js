// HARP
const StringToken = artifacts.require("StringToken");
const gStringToken = artifacts.require("gStringToken");
const TokenVesting = artifacts.require("TokenVesting");
const LatestFarm = artifacts.require("LatestFarm");
const LUSDLP = artifacts.require("LUSDLPToken");
const ETHLP = artifacts.require("ETHLPToken");
const LQTYToken = artifacts.require("LQTYToken");
const StringStaking = artifacts.require("StringStaking");
const LUSDToken = artifacts.require("LUSDToken.sol");
const StabilityFactory = artifacts.require("StabilityFactory.sol");

module.exports = async function (deployer, network, accounts) {
  const deploy = "ganache";

  // HARP
  // 2nd Ganache
  // Token Contract
  const HarpDAOAddress = "0x0cbde7d648C1F51253d53ca1dB099030Fc35490a";
  const owner = accounts[1];

  const addr = {
    kovan: {
      stabilityPool: { address: "0xAE5D0922152CC75E220ECEA0A8758c5FE545F9B0" },
      lqtyToken: { address: "0x386eBE55a61123Ff0f3fd10dA56DEb4E0Cf36590" },
      lusdToken: { address: "0x9CCeF31d8375ec9d72fF376e50869152770E5c59" },
    },
  };

  await deployer.deploy(LUSDToken, accounts[0], accounts[1]);
  await deployer.deploy(LQTYToken, accounts[0], accounts[1]);

  let lusdToken, lqtyToken, stabilityPool;

  if (deploy === "kovan") {
    lusdToken = addr.kovan.lusdToken;
    lqtyToken = addr.kovan.lqtyToken;
    stabilityPool = addr.kovan.stabilityPool;
  } else if (deploy === "ganache") {
    stabilityPool = addr.kovan.stabilityPool;
    lusdToken = await LUSDToken.deployed();
    lqtyToken = await LQTYToken.deployed();
  }
  await deployer.deploy(
    StringToken,
    "ozString",
    "ozSTRING",
    HarpDAOAddress,
    owner
  );
  const stringToken = await StringToken.deployed();

  // 3rd Ganache
  // Vesting Contract
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

  // 1st Ganache
  // Farm Deployments

  await deployer.deploy(LUSDLP, accounts[0], accounts[1]);
  await deployer.deploy(ETHLP, accounts[0], accounts[1]);
  await deployer.deploy(gStringToken, owner);
  const gstringToken = await gStringToken.deployed();
  await deployer.deploy(
    StringStaking,
    stringToken.address,
    100,
    lqtyToken.address,
    gstringToken.address
  );

  const ethLPToken = await ETHLP.deployed();
  const lusdLPToken = await LUSDLP.deployed();
  // 10e18 = 1000000000000000000
  //   base reward per block = 0.358974359
  // await deployer.deploy(
  //   Farm,
  //   ethLPToken.address,
  //   lusdLPToken.address,
  //   stringToken.address,
  //   358974359000000000
  // );
  await deployer.deploy(LatestFarm, stringToken.address, 100);

  const farm = await LatestFarm.deployed();
  const stringStaking = await StringStaking.deployed();

  await gstringToken.addVestingAddress(stringStaking.address, { from: owner });
  await stringToken.addVestingAddress(stringStaking.address, { from: owner });
  await stringToken.addVestingAddress(farm.address, { from: owner });
  await farm.add(80, ethLPToken.address, true);
  await farm.add(20, lusdLPToken.address, true);

  await deployer.deploy(
    StabilityFactory,
    stringStaking.address,
    lusdToken.address,
    stringToken.address,
    stabilityPool.address
  );
};
