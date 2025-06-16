require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== "undefined"
          ? [process.env.PRIVATE_KEY]
          : [],
      chainId: 11155111,
    },
    hardhat: {
      chainId: 1337,
    },

    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "0xbd4293311d8f0d9b41cf11dbcc48942feb6569aa48d4415ffe5995e9172916da",
      ],
      chainId: 1337,
    },
  },
  paths: {
    artifacts: "./artifacts",
  },
};
