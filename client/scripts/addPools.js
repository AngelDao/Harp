const LatestFarm = artifacts.require("LatestFarm");
// const {addresses } = require("./src/utils/")

module.exports = async function (callback) {
  const ethLPToken = "0x9eabd8792d86b14544b9d8c8a36d8baae248c15a";
  const lusdLPToken = "0xd19b8d9f6cf97b8e1931514707b3262d19d5dc3d";
  const farm = await LatestFarm.deployed();
  await farm.add(80, ethLPToken, true);
  await farm.add(20, lusdLPToken, true);
  callback();
};
