// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./InsuranceContract.sol";
import "./Condition.sol";

contract SmartContract {
    address public owner;
    bool public isActive;

    // Events to log significant actions
    event PaymentExecuted(address indexed recipient, uint amount);
    event ClaimFiled(address indexed conditionAddress);
    event PolicyValidated(address indexed insuranceContractAddress, bool isValid);

    constructor(address _owner) {
        owner = _owner;
        isActive = true;  // The smart contract is active upon deployment
    }

    function executePayment(address payable recipient, uint amount) public payable {
        require(isActive, "Contract is not active.");
        require(amount > 0, "Amount must be greater than zero.");
        require(address(this).balance >= amount, "Insufficient contract balance.");

        recipient.transfer(amount);
        emit PaymentExecuted(recipient, amount);
    }

    function validatePolicy(InsuranceContract insuranceContract) public returns (bool) {
        bool valid = insuranceContract.isValid();
        emit PolicyValidated(address(insuranceContract), valid);
        return valid;
    }

    function fileClaim(Condition condition) public {
        condition.submitClaim();
        emit ClaimFiled(address(condition));
    }

    receive() external payable {}
}
