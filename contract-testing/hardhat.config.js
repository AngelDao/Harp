/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-ethers");

const accounts = require("./hardhatAccounts.js");
const accountsList = accounts.accountsList;

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();
  const acc = [];
  for (const account of accounts) {
    console.log(account.provider);
    const bal = (await account.getBalance()).toString();
  }
});

module.exports = {
  networks: {
    hardhat: {
      accounts: accountsList,
      gas: 10000000, // tx gas limit
      blockGasLimit: 12500000,
      gasPrice: 20000000000,
    },
  },
  solidity: {
    paths: {
      tests: "./test",
      artifacts: "./artifacts",
    },
    compilers: [
      {
        version: "0.6.11",
      },

      {
        version: "0.4.23",
      },
    ],
  },
};
