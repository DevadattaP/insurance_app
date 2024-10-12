// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Condition.sol";

contract Term {
    string public termID;
    string public termType;
    Condition[] public conditions;

    // Event for adding a condition
    event ConditionAdded(Condition condition);

    constructor(string memory _termID, string memory _termType) {
        termID = _termID;
        termType = _termType;
    }

    function addCondition(Condition condition) public {
        conditions.push(condition);
        emit ConditionAdded(condition);  // Emit event when a condition is added
    }

    function getConditions() public view returns (Condition[] memory) {
        return conditions;
    }

    function evaluate() public view returns (bool) {
        for (uint i = 0; i < conditions.length; i++) {
            if (!conditions[i].status()) {
                return false;
            }
        }
        return true;
    }

    function getTermId() public view returns (string memory) {
        return termID;
    }

    function getTermType() public view returns (string memory) {
        return termType;
    }
}
