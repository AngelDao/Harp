const Farm = artifacts.require("Farm");
// const {addresses } = require("./src/utils/")

module.exports = async function (callback) {
  const ethLPToken = "0x30cf3d347815d2e7cd4e676fe68844d65e2eb7bc";
  const lusdLPToken = "0x585947e2cea2c10d33ce0ddfb43600386f010447";
  console.log("entered");
  const farm = await Farm.deployed();
  console.log("entered");
  await farm.add(80, ethLPToken, true);
  console.log("entered");
  await farm.add(20, lusdLPToken, true);
  console.log("entered");
  callback();
};
