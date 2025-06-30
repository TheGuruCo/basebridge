require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    basegoerli: {
      url: process.env.BASEGOERLI_RPC_URL,
      chainId: 84532,          // Sepolia Base chain ID :contentReference[oaicite:1]{index=1}
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
