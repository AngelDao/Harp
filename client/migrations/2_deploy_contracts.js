const StringToken = artifacts.require("StringToken");
const TokenVesting = artifacts.require("TokenVesting");

module.exports = async function (deployer) {
  // 2nd Ganache
  // Token Contract
  const HarpDAOAddress = "0x0cbde7d648C1F51253d53ca1dB099030Fc35490a";
  const owner = "0x0a3a13F87896F3F82CC4c62103b455e1B2df3892";
  await deployer.deploy(
    StringToken,
    "ozString",
    "ozSTRING",
    HarpDAOAddress,
    owner
  );
  const stringToken = await StringToken.deployed();

  // 3rd Ganache
  // Vesting Contract
  const AngelDAOAddress = "0x82c3455425f4B02297f241822D2dD6c4a7bbB189";
  const years = 365 * 2;
  await deployer.deploy(
    TokenVesting,
    AngelDAOAddress,
    years,
    stringToken.address
  );
  const tokenVesting = await TokenVesting.deployed();

  const vestingAddress = tokenVesting.address;

  await stringToken.addVestingAddress(vestingAddress);
};
