module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,            // Geth's HTTP port
      network_id: "12345",   // Private network ID
      gas: 9000000,          // Gas limit
      gasPrice: 0            // Zero gas price for local mining
    }
  },
  compilers: {
    solc: {
      version: "0.8.0"       // Your desired Solidity version
    }
  }
};
