// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Contract to manage the entire blockchain and pending insurance contracts
contract Blockchain {
    struct Block {
        uint index;
        uint timestamp;
        InsuranceContract[] contracts;
        bytes32 previousHash;
        bytes32 blockHash;
    }

    Block[] public chain;
    InsuranceContract[] public pendingContracts;

    function addBlock(InsuranceContract[] memory contracts, bytes32 previousHash) public {
        uint index = chain.length;
        uint timestamp = block.timestamp;

        // Create a new block
        Block memory newBlock = Block(index, timestamp, contracts, previousHash, 0);
        
        // Calculate hash of the new block
        newBlock.blockHash = calculateHash(newBlock);

        // Add the block to the blockchain
        chain.push(newBlock);

        // Clear the pending contracts list
        delete pendingContracts;
    }

    function calculateHash(Block memory blockData) public pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                blockData.index,
                blockData.timestamp,
                blockData.contracts,
                blockData.previousHash
            )
        );
    }

    function validateChain() public view returns (bool) {
        for (uint i = 1; i < chain.length; i++) {
            Block memory currentBlock = chain[i];
            Block memory previousBlock = chain[i - 1];

            // Check if block hash is correct
            if (currentBlock.blockHash != calculateHash(currentBlock)) {
                return false;
            }

            // Check if previous hash matches
            if (currentBlock.previousHash != previousBlock.blockHash) {
                return false;
            }
        }
        return true;
    }
}

// Represents an insurance contract in the blockchain
contract InsuranceContract {
    string public contractID;
    PolicyHolder public policyHolder;
    Insurer public insurer;
    Term[] public terms;
    bool public isActive;

    constructor(
        string memory _contractID,
        address policyHolderAddress,
        address insurerAddress
    ) {
        contractID = _contractID;
        policyHolder = PolicyHolder(policyHolderAddress);
        insurer = Insurer(insurerAddress);
        isActive = false; // Contract is inactive until signed
    }

    function signContract() public {
        require(!isActive, "Contract is already active.");
        isActive = true;
    }

    function isValid() public view returns (bool) {
        if (!isActive) return false;

        for (uint i = 0; i < terms.length; i++) {
            if (!terms[i].evaluate()) {
                return false;
            }
        }
        return true;
    }

    function addTerm(Term term) public {
        terms.push(term);
    }
}

// Represents the individual or entity holding the policy
contract PolicyHolder {
    string public holderId;
    InsuranceContract[] public policies;

    constructor(string memory _holderId) {
        holderId = _holderId;
    }

    function applyForInsurance(InsuranceContract insuranceContract) public {
        policies.push(insuranceContract);
    }
}

// Represents the insurance company offering the policy
contract Insurer {
    string public insurerId;
    InsuranceContract[] public offeredPolicies;

    constructor(string memory _insurerId) {
        insurerId = _insurerId;
    }

    function offerInsurance(InsuranceContract insuranceContract) public {
        offeredPolicies.push(insuranceContract);
    }
}

// Represents the terms and conditions of the insurance contract
contract Term {
    string public termID;
    string public termType;
    Condition[] public conditions;

    constructor(string memory _termID, string memory _termType) {
        termID = _termID;
        termType = _termType;
    }

    function addCondition(Condition condition) public {
        conditions.push(condition);
    }

    function evaluate() public view returns (bool) {
        // Logic to evaluate the conditions of the term
        for (uint i = 0; i < conditions.length; i++) {
            if (!conditions[i].status()) {
                return false;
            }
        }
        return true;
    }
}

// Represents a condition in a term that can be evaluated
contract Condition {
    uint public claimID;
    string public policyNumber;
    bool public _status;

    constructor(uint _claimID, string memory _policyNumber) {
        claimID = _claimID;
        policyNumber = _policyNumber;
        _status = false;
    }

    function submitClaim() public {
        // Logic to submit a claim
        _status = true;
    }

    function updateStatus(bool newStatus) public {
        _status = newStatus;
    }

    function status() public view returns (bool) {
        return _status;
    }
}

// Smart contract logic for executing transactions based on predefined conditions
contract SmartContract {
    address public contractAddress;
    address public owner;
    bool public isActive;

    constructor(address _owner) {
        owner = _owner;
        isActive = true;
    }

    function executePayment(address payable recipient, uint amount) public payable {
        require(isActive, "Contract is not active.");
        recipient.transfer(amount);
    }

    function validatePolicy(InsuranceContract insuranceContract) public view returns (bool) {
        return insuranceContract.isValid();
    }

    function fileClaim(Condition condition) public {
        condition.submitClaim();
    }

    receive() external payable {}
}

// Represents a transaction in the system
contract Transaction {
    address public fromAddress;
    address public toAddress;
    uint public amount;

    constructor(address _fromAddress, address _toAddress, uint _amount) {
        fromAddress = _fromAddress;
        toAddress = _toAddress;
        amount = _amount;
    }
}
