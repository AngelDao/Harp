const LatestFarm = artifacts.require("LatestFarm");
// const {addresses } = require("./src/utils/")

module.exports = async function (callback) {
  const ethLPToken = "0x14244DdE3aCe091E0AD2a6868d27543Bd839f0D3";
  const lusdLPToken = "0x512d5E44ad6e1bf77fdDC58Ef34e12658232393f";
  const farm = await LatestFarm.deployed();
  await farm.add(80, ethLPToken, true);
  await farm.add(20, lusdLPToken, true);
  callback();
};
