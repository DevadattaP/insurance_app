// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./InsuranceContract.sol";

contract Insurer {
    string public insurerId;
    InsuranceContract[] public offeredPolicies;

    // Event for insurance offer
    event InsuranceOffered(InsuranceContract insuranceContract);

    constructor(string memory _insurerId) {
        insurerId = _insurerId;
    }

    function offerInsurance(InsuranceContract insuranceContract) public {
        offeredPolicies.push(insuranceContract);
        emit InsuranceOffered(insuranceContract);  // Emit event when insurance is offered
    }

    function getInsurerId() public view returns (string memory) {
        return insurerId;
    }

    function getOfferedPolicies() public view returns (InsuranceContract[] memory) {
        return offeredPolicies;
    }
}
