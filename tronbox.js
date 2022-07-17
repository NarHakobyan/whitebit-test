require("dotenv").config();

const port = process.env.HOST_PORT || 9090;

module.exports = {
  networks: {
    development: {
      // For trontools/quickstart docker image
      privateKey: process.env.PRIVATE_KEY_DEV,
      userFeePercentage: 0,
      feeLimit: 1e8,
      fullHost: `http://127.0.0.1:${port}`,
      network_id: "9",
    },
    compilers: {
      solc: {
        version: "0.5.10",
      },
    },
  },
};
