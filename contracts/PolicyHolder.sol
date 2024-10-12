// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./InsuranceContract.sol";

contract PolicyHolder {
    string public holderId;
    InsuranceContract[] public policies;

    // Event for policy application
    event PolicyApplied(InsuranceContract insuranceContract);

    constructor(string memory _holderId) {
        holderId = _holderId;
    }

    function applyForInsurance(InsuranceContract insuranceContract) public {
        policies.push(insuranceContract);
        emit PolicyApplied(insuranceContract);  // Emit event when a policy is applied for
    }

    function getHolderId() public view returns (string memory) {
        return holderId;
    }

    function getPolicies() public view returns (InsuranceContract[] memory) {
        return policies;
    }
}
