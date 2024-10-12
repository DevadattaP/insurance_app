import React, { useContext, useState } from 'react';
import Web3 from 'web3';
import ConditionContract from '../contracts/Condition.json';
import { AppContext } from '../AppContext';

const Condition = ({ goToTab }) => {
    const { contracts, formData, updateFormData, updateContract } = useContext(AppContext);
    const [isProcessing, setIsProcessing] = useState(false); // Loading state

    const deployCondition = async () => {
        const conditionData = formData.condition;
        if (!conditionData.claimId || !conditionData.policyNumber) {
            alert('Please fill in both fields before submitting.');
            return;
        }

        setIsProcessing(true);
        const web3 = new Web3('http://127.0.0.1:8545');
        const accounts = await web3.eth.getAccounts();

        const instance = new web3.eth.Contract(ConditionContract.abi);
        try {
            const result = await instance.deploy({
                data: ConditionContract.bytecode,
                arguments: [conditionData.claimId, conditionData.policyNumber],
            }).send({
                from: accounts[0],
                gas: 3000000,
                gasPrice: web3.utils.toWei('20', 'gwei'),
            });

            updateContract('condition', result.options.address); // Update the condition contract address in context
            updateFormData('condition', { isSubmitted: true }); // Mark as submitted
            alert('Condition deployed successfully at address: ' + result.options.address);
            goToTab('insuranceContract'); // Navigate to the next tab
        } catch (error) {
            console.error('Error deploying Condition:', error);
            alert('Error deploying Condition: ' + error.message);
        }
        setIsProcessing(false);
    };

    const submitClaim = async () => {
        const web3 = new Web3('http://127.0.0.1:8545');
        const accounts = await web3.eth.getAccounts();
        const conditionAddress = contracts.condition;

        if (!conditionAddress) {
            alert('Condition contract address not found. Make sure it is deployed and set correctly.');
            return;
        }

        const instance = new web3.eth.Contract(ConditionContract.abi, conditionAddress);
        try {
            await instance.methods.submitClaim().send({
                from: accounts[0],
                gas: 3000000,
                gasPrice: web3.utils.toWei('20', 'gwei'),
            });
            alert('Claim submitted successfully');
        } catch (error) {
            console.error('Error submitting claim:', error);
            alert('Error submitting claim: ' + error.message);
        }
    };

    const updateStatus = async () => {
        const web3 = new Web3('http://127.0.0.1:8545');
        const accounts = await web3.eth.getAccounts();
        const conditionAddress = contracts.condition;

        if (!conditionAddress) {
            alert('Condition contract address not found. Make sure it is deployed and set correctly.');
            return;
        }

        const instance = new web3.eth.Contract(ConditionContract.abi, conditionAddress);
        try {
            await instance.methods.updateStatus(formData.condition.status).send({
                from: accounts[0],
                gas: 3000000,
                gasPrice: web3.utils.toWei('20', 'gwei'),
            });
            alert('Status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error updating status: ' + error.message);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Deploy Condition Contract</h2>
            <div className="form-group">
                <label>Claim ID:</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.condition.claimId}
                    onChange={(e) => updateFormData('condition', { claimId: e.target.value })}
                    disabled={formData.condition.isSubmitted || isProcessing}
                />
            </div>
            <div className="form-group">
                <label>Policy Number:</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.condition.policyNumber}
                    onChange={(e) => updateFormData('condition', { policyNumber: e.target.value })}
                    disabled={formData.condition.isSubmitted || isProcessing}
                />
            </div>
            <button
                className="btn btn-primary mt-2"
                onClick={deployCondition}
                disabled={formData.condition.isSubmitted || isProcessing}
            >
                {isProcessing ? "Deploying..." : (formData.condition.isSubmitted ? "Deployed" : "Deploy Condition")}
            </button>
            <div className="mt-4">
                <h2>Claim Operations</h2>
                <button
                    className="btn btn-secondary mt-2"
                    onClick={submitClaim}
                    disabled={!formData.condition.isSubmitted}
                >
                    Submit Claim
                </button>
                <div className="form-group mt-2">
                    <label>Status (true/false):</label>
                    <input
                        type="text"
                        className="form-control"
                        value={formData.condition.status}
                        onChange={(e) => updateFormData('condition', { status: e.target.value })}
                    />
                </div>
                <button
                    className="btn btn-danger mt-2"
                    onClick={updateStatus}
                    disabled={!formData.condition.isSubmitted}
                >
                    Update Status
                </button>
            </div>
        </div>
    );
};

export default Condition;
