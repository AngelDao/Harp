const LatestFarm = artifacts.require("LatestFarm");

module.exports = async function (callback) {
  const ethLPToken = "0xa6e54998b897765c39ae032a5d88034fbaca088c";
  const lusdLPToken = "0x4f64459ae112a40c509b3ead00c343a260bd9155";
  const farm = await LatestFarm.deployed();
  await farm.add(80, ethLPToken, true);
  await farm.add(20, lusdLPToken, true);
  callback();
};
