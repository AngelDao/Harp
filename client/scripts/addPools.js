const LatestFarm = artifacts.require("LatestFarm");

module.exports = async function (callback) {
  const ethLPToken = "0xfb91e5d2bcafcc336a2c5c0f0cf6749b0721ea12";
  const lusdLPToken = "0x5036882451a000407ade3f9f735ba523f8c9f209";
  const farm = await LatestFarm.deployed();
  await farm.add(80, ethLPToken, true);
  await farm.add(20, lusdLPToken, true);
  callback();
};
