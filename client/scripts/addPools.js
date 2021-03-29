const LatestFarm = artifacts.require("LatestFarm");

module.exports = async function (callback) {
  const ethLPToken = "0x1810016dc7a6ff69dd0de0a1eacf79aa86752114";
  const lusdLPToken = "0x103cc22b0bf45f759aa7f40188231aea5f83076e";
  const farm = await LatestFarm.deployed();
  await farm.add(80, ethLPToken, true);
  await farm.add(20, lusdLPToken, true);
  callback();
};
