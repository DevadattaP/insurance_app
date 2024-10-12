// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./InsuranceContract.sol";

contract Blockchain {
    struct Block {
        uint index;
        uint timestamp;
        address[] contracts; // Store addresses of contracts
        bytes32 previousHash;
        bytes32 blockHash;
    }

    Block[] public chain;
    InsuranceContract[] public pendingContracts;

    // Events
    event BlockAdded(uint index, bytes32 blockHash);
    event ChainValidated(bool isValid);

    constructor() {
        // Initialize the blockchain with a genesis block
        address[] memory emptyContracts;
        addBlock(emptyContracts, "0x0"); // Genesis block
    }

    function addBlock(address[] memory contracts, bytes32 previousHash) public returns (uint, bytes32) {
        uint index = chain.length;
        uint timestamp = block.timestamp;

        Block memory newBlock = Block(index, timestamp, contracts, previousHash, 0);
        newBlock.blockHash = calculateHash(newBlock);

        chain.push(newBlock);

        delete pendingContracts;

        emit BlockAdded(index, newBlock.blockHash);  // Emit event
        return (index, newBlock.blockHash);
    }

    function validateChain() public returns (bool) {
        for (uint i = 1; i < chain.length; i++) {
            Block memory currentBlock = chain[i];
            Block memory previousBlock = chain[i - 1];

            if (currentBlock.blockHash != calculateHash(currentBlock)) {
                emit ChainValidated(false);  // Emit event if validation fails
                return false;
            }

            if (currentBlock.previousHash != previousBlock.blockHash) {
                emit ChainValidated(false);  // Emit event if validation fails
                return false;
            }
        }

        emit ChainValidated(true);  // Emit event if chain is valid
        return true;
    }

    function calculateHash(Block memory blockData) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(blockData.index, blockData.timestamp, blockData.contracts, blockData.previousHash));
    }

    // New function to retrieve the hash of the last block
    function getLastBlockHash() public view returns (bytes32) {
        require(chain.length > 0, "No blocks in the chain");
        return chain[chain.length - 1].blockHash;
    }
}
