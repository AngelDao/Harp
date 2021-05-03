const { addresses } = require("../src/utils/handleContracts/addresses");
const { ethers, artifacts } = require("hardhat");
const Farm = require("../src/abis/Farm.json");

const main = async () => {
  const networkMap = {
    kovan: 42,
    rinkeby: 4,
  };
  let eth, lusd;
  if (process.env.HARDHAT_NETWORK === "kovan") {
    eth = addresses.kovan.ethLPToken;
    lusd = addresses.kovan.lusdLPToken;
  } else if (process.env.HARDHAT_NETWORK === "rinkeby") {
    eth = addresses.rinkeby.ethLPToken;
    lusd = addresses.rinkeby.lusdLPToken;
  }
  console.log(eth, lusd);

  const [deployer] = await ethers.getSigners();

  console.log(Farm.networks[networkMap[process.env.HARDHAT_NETWORK]].address);
  console.log(Farm.networks[networkMap[process.env.HARDHAT_NETWORK]].address);
  console.log(Farm.networks[networkMap[process.env.HARDHAT_NETWORK]].address);
  console.log(Farm.networks[networkMap[process.env.HARDHAT_NETWORK]].address);
  const farm = new ethers.Contract(
    Farm.networks[networkMap[process.env.HARDHAT_NETWORK]].address,
    Farm.abi,
    deployer.provider
  );
  console.log("start adding");
  try {
    // await farm.connect(deployer).addPool(80, eth, true);
  } catch (err) {
    console.log(err);
  }
  console.log("pool1 added");
  try {
    await farm.connect(deployer).addPool(20, lusd, true);
  } catch (err) {
    console.log(err);
  }
  console.log("pool2 added");
};

(async () => {
  try {
    await main();
  } catch (err) {
    console.log(err);
  }
})();
