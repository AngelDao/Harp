/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * trufflesuite.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

// const HDWalletProvider = require('@truffle/hdwallet-provider');
// const infuraKey = "fj4jll3k.....";
//
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

const HDWalletProvider = require("@truffle/hdwallet-provider");
const { pkMain } = require("./scripts/secret");
require("dotenv").config({ path: "./src/.env" });
const endpointUrlKovan =
  "https://kovan.infura.io/v3/1161cdc1e4e143649ab82b0037230ac1";

const endpointUrlRink =
  "https://rinkeby.infura.io/v3/1161cdc1e4e143649ab82b0037230ac1";

const endpointURLMainnet =
  "https://mainnet.infura.io/v3/1161cdc1e4e143649ab82b0037230ac1";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
    },
    kovan: {
      network_id: "42",
      provider: function () {
        return new HDWalletProvider(
          "biology inch series welcome conduct nothing parade save salmon lyrics whisper gold",
          //url to ethereum node
          endpointUrlKovan
        );
      },
      gas: 4600000,
    },
    live: {
      gasPrice: 50000000000,
      gas: 4600000,
      network_id: 1,
      provider: function () {
        return new HDWalletProvider({
          privateKeys: [pkMain],
          providerOrUrl: endpointURLMainnet,
        });
      },
    },
    rinkeby: {
      gas: 4600000,
      network_id: 4,
      provider: function () {
        return new HDWalletProvider(
          "biology inch series welcome conduct nothing parade save salmon lyrics whisper gold",
          //url to ethereum node
          endpointUrlRink
        );
      },
    },
  },
  contracts_directory: "./contracts/",
  contracts_build_directory: "./src/abis/",
  compilers: {
    solc: {
      version: "0.6.11",
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "petersburg",
    },
  },
};
