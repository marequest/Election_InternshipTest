const path = require("path");

const HDWalletProvider = require('@truffle/hdwallet-provider')
const fs = require('fs')



require('dotenv').config();
var mnemonic = process.env["NEMONIC"];
var tokenKey = process.env["ENDPOINT_KEY"];

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
    contracts_directory: './src/contracts/',
    contracts_build_directory: './src/abis/',
  networks: {
    develop: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*',
    },
    rinkeby: {
      provider: () =>
          new HDWalletProvider({
            mnemonic: {
              phrase: mnemonic
            },
            providerOrUrl: "https://rinkeby.infura.io/v3/" + tokenKey,
            numberOfAddresses: 1,
            shareNonce: true,
          }),
      network_id: '4',
    },
  },
  compilers: {
    solc: {
      version: "pragma",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
