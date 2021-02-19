// // /* eslint-disable no-undef */
// // LIQUITY

// const SortedTroves = artifacts.require("./SortedTroves.sol")
// const ActivePool = artifacts.require("./ActivePool.sol")
// const DefaultPool = artifacts.require("./DefaultPool.sol")
const StabilityPool = artifacts.require("StabilityPool.sol")
// const TroveManager = artifacts.require("./TroveManager.sol")
// const PriceFeed = artifacts.require("./PriceFeed.sol")
const LUSDToken = artifacts.require("LUSDToken.sol")
// const FunctionCaller = artifacts.require("./FunctionCaller.sol")
// const BorrowerOperations = artifacts.require("./BorrowerOperations.sol")

// const deploymentHelpers = require("../testUtils/truffleDeploymentHelpers.js")

// const getAddresses = deploymentHelpers.getAddresses
// const connectContracts = deploymentHelpers.connectContracts

// HARP
const StringToken = artifacts.require("StringToken");
const gStringToken = artifacts.require("gStringToken");
const TokenVesting = artifacts.require("TokenVesting");
const LatestFarm = artifacts.require("LatestFarm");
const LUSDLP = artifacts.require("LUSDLPToken");
const ETHLP = artifacts.require("ETHLPToken");
const LQTYToken = artifacts.require("LQTYToken");
const StringStaking = artifacts.require("StringStaking");


module.exports = async function (deployer, network, accounts) {
  // // LIQUITY
  // await deployer.deploy(BorrowerOperations)
  // await deployer.deploy(PriceFeed)
  //  await deployer.deploy(SortedTroves)
  //  await deployer.deploy(TroveManager)
  //  await deployer.deploy(ActivePool)
  //  await deployer.deploy(StabilityPool)
  //  await deployer.deploy(DefaultPool)
  //  await deployer.deploy(LUSDToken)
  //  await deployer.deploy(FunctionCaller)

  // const borrowerOperations = await BorrowerOperations.deployed()
  // const priceFeed = await PriceFeed.deployed()
  //   const sortedTroves = await SortedTroves.deployed()
  //   const troveManager = await TroveManager.deployed()
  //   const activePool = await ActivePool.deployed()
    const stabilityPool = await StabilityPool.deployed()
  //   const defaultPool = await DefaultPool.deployed()
    const lusdToken = await LUSDToken.deployed()
  //   const functionCaller = await FunctionCaller.deployed()

  //   const liquityContracts = {
  //     borrowerOperations,
  //     priceFeed,
  //     lusdToken,
  //     sortedTroves,
  //     troveManager,
  //     activePool,
  //     stabilityPool,
  //     defaultPool,
  //     functionCaller
  //   }

  //   // Grab contract addresses
  //   const liquityAddresses = getAddresses(liquityContracts)
  //   console.log('deploy_contracts.js - Deployed contract addresses: \n')
  //   console.log(liquityAddresses)
  //   console.log('\n')

  //   // Connect contracts to each other
  //   await connectContracts(liquityContracts, liquityAddresses)






  // HARP
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
  await deployer.deploy(LUSDToken, accounts[0], accounts[1]);
  await deployer.deploy(LQTYToken, accounts[0], accounts[1]);
  await deployer.deploy(gStringToken, owner);
  const gstringToken = await gStringToken.deployed();
  // const lusdToken = await LUSDToken.deployed();
  const lqtyToken = await LQTYToken.deployed();
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
  await deployer.deploy(
    LatestFarm,
    stringToken.address,
    100,
    );

  const farm = await LatestFarm.deployed();
  const stringStaking = await StringStaking.deployed();

  await gstringToken.addVestingAddress(stringStaking.address, { from: owner });
  await stringToken.addVestingAddress(stringStaking.address, { from: owner });
  await stringToken.addVestingAddress(farm.address, { from: owner });
  await farm.add(80, ethLPToken.address, true);
  await farm.add(20, lusdLPToken.address, true);
};
