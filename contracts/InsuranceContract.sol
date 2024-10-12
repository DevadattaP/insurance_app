// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PolicyHolder.sol";
import "./Insurer.sol";
import "./Term.sol";

contract InsuranceContract {
    string public contractID;
    PolicyHolder public policyHolder;
    Insurer public insurer;
    Term[] public terms;
    bool public isActive;

    // Events
    event ContractSigned(string contractID);
    event TermAdded(Term term);

    constructor(string memory _contractID, address policyHolderAddress, address insurerAddress) {
        contractID = _contractID;
        policyHolder = PolicyHolder(policyHolderAddress);
        insurer = Insurer(insurerAddress);
        isActive = false; // Contract is inactive until signed
    }

    // Activate the insurance contract
    function signContract() public {
        require(!isActive, "Contract is already active.");
        isActive = true;
        emit ContractSigned(contractID);  // Emit event on signing
    }

    // Add a new term to the insurance contract
    function addTerm(Term term) public {
        terms.push(term);
        emit TermAdded(term);  // Emit event when a term is added
    }

    function getContractId() public view returns (string memory) {
        return contractID;
    }

    function getInsurer() public view returns (address) {
        return address(insurer);
    }

    function checkIsActive() public view returns (bool) {
        return isActive;
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

    function getPolicyHolder() public view returns (address) {
        return address(policyHolder);
    }

    function getTerms() public view returns (Term[] memory) {
        return terms;
    }
}
