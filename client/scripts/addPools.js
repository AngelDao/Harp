const LatestFarm = artifacts.require("LatestFarm");
// const {addresses } = require("./src/utils/")

module.exports = async function (callback) {
  const ethLPToken = "0xda937ccea640b54233cd885905b23b853d31034c";
  const lusdLPToken = "0x64781266a68816ddd83e68ec90874c31a6089169";
  const farm = await LatestFarm.deployed();
  await farm.add(80, ethLPToken, true);
  await farm.add(20, lusdLPToken, true);
  callback();
};
