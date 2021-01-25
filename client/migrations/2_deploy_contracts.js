const StringToken = artifacts.require("StringToken");
const TokenVesting = artifacts.require("TokenVesting");
const LatestFarm = artifacts.require("LatestFarm");
const LUSDLP = artifacts.require("LUSDLPToken");
const ETHLP = artifacts.require("ETHLPToken");

module.exports = async function (deployer, network, accounts) {
  // 2nd Ganache
  // Token Contract
  const HarpDAOAddress = "0x0cbde7d648C1F51253d53ca1dB099030Fc35490a";
  const owner = accounts[1];
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

  await stringToken.addVestingAddress(farm.address, { from: owner });
  await farm.add(80, ethLPToken.address, true);
  await farm.add(20, lusdLPToken.address, true);
};
