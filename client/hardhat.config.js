/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-ethers");
const { pk, pkMain } = require("./scripts/secret.js");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const endpointUrlKovan =
  "https://kovan.infura.io/v3/1161cdc1e4e143649ab82b0037230ac1";

const endpointUrlRink =
  "https://rinkeby.infura.io/v3/1161cdc1e4e143649ab82b0037230ac1";

const endpointURLMainnet =
  "https://mainnet.infura.io/v3/1161cdc1e4e143649ab82b0037230ac1";

module.exports = {
  networks: {
    hardhat: {
      gas: 10000000, // tx gas limit
      blockGasLimit: 12500000,
      gasPrice: 20000000000,
    },
    live: {
      network_id: "1",
      gas: 100000000, // tx gas limit
      gasPrice: 170000000000,
      url: endpointURLMainnet,
      accounts: [pkMain],
    },
    kovan: {
      network_id: "42",
      gas: 12499988, // tx gas limit
      url: endpointUrlKovan,
      accounts: [pk],
    },
    rinkeby: {
      network_id: 4,
      gas: 100000000, // tx gas limit
      url: endpointUrlRink,
      accounts: [pk],
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.4.23",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
      {
        version: "0.5.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
      {
        version: "0.6.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
    ],
  },
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
};
