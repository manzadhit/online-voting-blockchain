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
      accounts:
        process.env.ADMIN_PRIVATE_KEY !== "undefined"
          ? [process.env.ADMIN_PRIVATE_KEY]
          : [],
      chainId: 1337,
    },
  },
  paths: {
    artifacts: "./artifacts",
  },
};
