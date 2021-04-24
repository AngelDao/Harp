// // HARP

const { addresses } = require("../src/utils/handleContracts/addresses");

const { ethers, artifacts } = require("hardhat");

const main = async () => {
  // HARP
  // 2nd Ganache
  // Token Contract

  let wallet = await ethers.Wallet.fromMnemonic(
    "biology inch series welcome conduct nothing parade save salmon lyrics whisper gold"
  );

  const HarpDAOAddress = "0xdF7054884fCb9A8681490A1D977fbD295C02cCFF";
  const AngelDAOAddress = "0x3Af2d668Afd7eF2B94b0862aE759712c067DFa4c";
  const years = 365 * 2;

  let lusdToken, lqtyToken, stabilityPool, provider;

  if (process.env.HARDHAT_NETWORK === "kovan") {
    provider = await new ethers.providers.InfuraProvider(
      "kovan",
      "1161cdc1e4e143649ab82b0037230ac1"
    );
    lusdToken = addresses.kovan.lusdToken;
    lqtyToken = addresses.kovan.lqtyToken;
    stabilityPool = addresses.kovan.stabilityPool;
  } else if (process.env.HARDHAT_NETWORK === "ganache") {
    stabilityPool = addresses.kovan.stabilityPool;
    // lusdToken = await LUSDToken.deployed();
    // lqtyToken = await LQTYToken.deployed();
  } else if (process.env.HARDHAT_NETWORK === "rinkeby") {
    provider = await new ethers.providers.InfuraProvider(
      "rinkeby",
      "1161cdc1e4e143649ab82b0037230ac1"
    );
    lusdToken = addresses.rinkeby.lusdToken;
    lqtyToken = addresses.rinkeby.lqtyToken;
    stabilityPool = addresses.rinkeby.stabilityPool;
  }

  console.log(provider);

  wallet = wallet.connect(provider);

  console.log(wallet.privateKey);

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const StringToken = await ethers.getContractFactory("StringToken");
  const TokenVesting = await ethers.getContractFactory("TokenVesting");
  const gStringToken = await ethers.getContractFactory("gStringToken");
  const StringStaking = await ethers.getContractFactory("StringStaking");
  const Farm = await ethers.getContractFactory("Farm");
  const StabilityFactory = await ethers.getContractFactory("StabilityFactory");
  console.log(wallet);
  const stringToken = await StringToken.deploy(
    "String",
    "STRING",
    HarpDAOAddress,
    deployer.address
  );
  console.log("new wallets");

  const tokenVesting = await TokenVesting.deploy(
    AngelDAOAddress,
    years,
    stringToken.address
  );
  console.log("deploy tokenvesting");

  const vestingAddress = tokenVesting.address;

  await stringToken.addMinter(vestingAddress);

  const gstringToken = await gStringToken.deploy(deployer.address);

  console.log("deploy gStringToken");
  const stringStaking = await StringStaking.deploy(
    stringToken.address,
    100,
    lqtyToken,
    gstringToken.address,
    stabilityPool
  );
  console.log("deploy stringStaking");

  const farm = await Farm.deploy(stringToken.address, 100);
  console.log("deploy farm");

  await stringStaking.registerIt();

  console.log("register");
  await gstringToken.addMinter(stringStaking.address);
  await stringToken.addMinter(stringStaking.address);
  await stringToken.addMinter(farm.address);
  console.log("add minters");

  const stabilityFactory = await StabilityFactory.connect(
    wallet.provider
  ).deploy(
    stringStaking.address,
    lusdToken,
    lqtyToken,
    stringToken.address,
    stabilityPool,
    100
  );
  console.log("deploy stabilityfactory");

  await stringToken.addMinter(stabilityFactory.address);
  console.log("done");
};

(async () => {
  try {
    await main();
  } catch (err) {
    console.log(err);
  }
})();
