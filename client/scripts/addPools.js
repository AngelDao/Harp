const LatestFarm = artifacts.require("LatestFarm");
// const {addresses } = require("./src/utils/")

module.exports = async function (callback) {
  const ethLPToken = "0x82a22294461ff0aeb10d572e2a0d1fc8bd05ca77";
  const lusdLPToken = "0x5331d0a466e0f529d347ddafbb2de54abf34ea72";
  const farm = await LatestFarm.deployed();
  await farm.add(80, ethLPToken, true);
  await farm.add(20, lusdLPToken, true);
  callback();
};
