require('@nomicfoundation/hardhat-toolbox');

const privateKey = process.env.DEPLOYER_PRIVATE_KEY;

module.exports = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: { enabled: true, runs: 200 }
    }
  },
  networks: {
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
      accounts: privateKey ? [privateKey] : []
    },
    base: {
      url: process.env.BASE_MAINNET_RPC_URL || 'https://mainnet.base.org',
      accounts: privateKey ? [privateKey] : []
    }
  }
};
