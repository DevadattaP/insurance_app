import Web3 from 'web3';

let web3;

// Check if the user is using a modern dApp browser (MetaMask)
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // Modern dApp browsers with MetaMask support
  web3 = new Web3(window.ethereum);
  try {
    // Request account access if needed (optional for Geth)
    window.ethereum.request({ method: 'eth_requestAccounts' });
  } catch (error) {
    console.error("User denied account access");
  }
} else {
  // Fallback to connecting to Geth locally
  const provider = new Web3.providers.HttpProvider('http://localhost:8545');
  web3 = new Web3(provider);
}

export default web3;
