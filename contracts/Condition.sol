// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Condition {
    uint public claimID;
    string public policyNumber;
    bool public status;  // Renamed for clarity

    // Event for claim submission
    event ClaimSubmitted(uint claimID);

    constructor(uint _claimID, string memory _policyNumber) {
        claimID = _claimID;
        policyNumber = _policyNumber;
        status = false;
    }

    function submitClaim() public {
        status = true;
        emit ClaimSubmitted(claimID);  // Emit event on claim submission
    }

    function updateStatus(bool newStatus) public {
        status = newStatus;
    }

    function getClaimId() public view returns (uint) {
        return claimID;
    }

    function getPolicyNumber() public view returns (string memory) {
        return policyNumber;
    }

    function getStatus() public view returns (bool) {
        return status;
    }
}
