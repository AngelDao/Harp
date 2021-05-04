const { addresses } = require("../src/utils/handleContracts/addresses");
const { ethers, artifacts } = require("hardhat");
const Farm = require("../src/abis/Farm.json");

const main = async () => {
  const networkMap = {
    kovan: 42,
    rinkeby: 4,
    live: 1,
  };
  let eth, lusd;
  if (process.env.HARDHAT_NETWORK === "kovan") {
    eth = addresses.kovan.ethLPToken;
    lusd = addresses.kovan.lusdLPToken;
  } else if (process.env.HARDHAT_NETWORK === "rinkeby") {
    eth = addresses.rinkeby.ethLPToken;
    lusd = addresses.rinkeby.lusdLPToken;
  } else if (process.env.HARDHAT_NETWORK === "live") {
    eth = addresses.mainnet.ethLPToken;
    lusd = addresses.mainnet.lusdLPToken;
  }
  console.log(eth, lusd);

  const [deployer] = await ethers.getSigners();

  console.log(deployer);

  console.log(Farm.networks[networkMap[process.env.HARDHAT_NETWORK]].address);
  console.log(Farm.networks[networkMap[process.env.HARDHAT_NETWORK]].address);
  console.log(Farm.networks[networkMap[process.env.HARDHAT_NETWORK]].address);
  console.log(Farm.networks[networkMap[process.env.HARDHAT_NETWORK]].address);
  const farm = new ethers.Contract(
    Farm.networks[networkMap[process.env.HARDHAT_NETWORK]].address,
    Farm.abi,
    deployer.provider
  );

  var transaction = {
    to: "0x814ABE103dC65258ecc862012Db0Fb1dCdF57E81",
    value: ethers.utils.parseEther("0"),
    nonce: 39,
  };
  console.log("start adding");
  try {
    // await farm.connect(deployer).addPool(false, false, 10, { nonce: 37 });
    await deployer.sendTransaction(transaction);
  } catch (err) {
    console.log(err);
  }
  console.log("pool1 added");
  try {
    // await farm.connect(deployer).addPool(20, lusd, true);
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
