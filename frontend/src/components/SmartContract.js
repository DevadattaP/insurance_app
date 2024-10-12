import React, { useContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import SmartContractArtifact from '../contracts/SmartContract.json';
import { AppContext } from '../AppContext';

const SmartContract = ({ goToTab }) => {
    const { contracts, formData, updateFormData } = useContext(AppContext);
    const [isProcessing, setIsProcessing] = useState(false);

    // Load initial data from context
    useEffect(() => {
        const recipient = formData.smartContract.recipient || contracts.policyHolder || '';
        const policyAddress = formData.smartContract.policyAddress || contracts.insuranceContract || '';
        const conditionAddress = formData.smartContract.conditionAddress || contracts.condition || '';

        // Only update if the values are different to avoid endless loops
        if (
            recipient !== formData.smartContract.recipient ||
            policyAddress !== formData.smartContract.policyAddress ||
            conditionAddress !== formData.smartContract.conditionAddress
        ) {
            updateFormData('smartContract', {
                recipient,
                policyAddress,
                conditionAddress
            });
        }
    }, [contracts, formData.smartContract, updateFormData]);

    const executePayment = async () => {
        const { recipient, amount } = formData.smartContract;
        if (!recipient || !amount) {
            alert('Please provide recipient and amount.');
            return;
        }

        const smartContractAddress = contracts.smartContract;

        if (!smartContractAddress) {
            alert('SmartContract address not found. Make sure it is deployed and set correctly.');
            return;
        }

        const web3 = new Web3('http://127.0.0.1:8545');
        const accounts = await web3.eth.getAccounts();
        const instance = new web3.eth.Contract(SmartContractArtifact.abi, smartContractAddress);

        try {
            console.log('Executing payment to:', recipient, 'Amount:', amount); // Debugging log
            console.log('Amount in wei:', web3.utils.toWei(amount, 'ether')); // Log amount conversion
            setIsProcessing(true);
            await instance.methods.executePayment(recipient, web3.utils.toWei(amount, 'ether'))
                .send({ from: accounts[0], gas: 3000000, gasPrice: web3.utils.toWei('20', 'gwei') });

            alert('Payment executed successfully');
            updateFormData('smartContract', { isSubmitted: true });
            goToTab('blockchain');
        } catch (error) {
            console.error('Error executing payment:', error.message, error.stack); // Log detailed error
            alert('Error executing payment: ' + error.message);
        } finally {
            setIsProcessing(false); // Reset loading state
        }
    };

    const validatePolicy = async () => {
        const policyAddress = formData.smartContract.policyAddress;
        const web3 = new Web3('http://127.0.0.1:8545');
        const smartContractAddress = contracts.smartContract;

        if (!smartContractAddress) {
            alert('SmartContract address not found. Make sure it is deployed and set correctly.');
            return;
        }

        const instance = new web3.eth.Contract(SmartContractArtifact.abi, smartContractAddress);

        try {
            const isValid = await instance.methods.validatePolicy(policyAddress).call();
            updateFormData('smartContract', { isValid });
            alert(isValid ? 'Policy is valid' : 'Policy is not valid');
        } catch (error) {
            alert('Error validating policy: ' + error.message);
        }
    };

    const fileClaim = async () => {
        const { conditionAddress } = formData.smartContract;
        const web3 = new Web3('http://127.0.0.1:8545');
        const accounts = await web3.eth.getAccounts();
        const smartContractAddress = contracts.smartContract;

        if (!smartContractAddress) {
            alert('SmartContract address not found. Make sure it is deployed and set correctly.');
            return;
        }

        if (!conditionAddress) {
            alert('Condition address is required to file a claim.');
            return;
        }

        const instance = new web3.eth.Contract(SmartContractArtifact.abi, smartContractAddress);

        try {
            await instance.methods.fileClaim(conditionAddress)
                .send({ from: accounts[0], gas: 3000000, gasPrice: web3.utils.toWei('20', 'gwei') });

            alert('Claim filed successfully');
        } catch (error) {
            alert('Error filing claim: ' + error.message);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Smart Contract Operations</h2>
            <div className="form-group">
                <label>Recipient Address:</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.smartContract.recipient}
                    onChange={(e) => updateFormData('smartContract', { recipient: e.target.value })}
                    disabled={formData.smartContract.isSubmitted}
                />
            </div>
            <div className="form-group">
                <label>Amount (ETH):</label>
                <input
                    type="number"
                    className="form-control"
                    value={formData.smartContract.amount}
                    onChange={(e) => updateFormData('smartContract', { amount: e.target.value })}
                />
            </div>
            <button className="btn btn-primary mt-2" onClick={executePayment} disabled={isProcessing || formData.smartContract.isSubmitted}>
                {isProcessing ? 'Processing...' : 'Execute Payment'}
            </button>

            <div className="form-group mt-4">
                <label>Policy Address:</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.smartContract.policyAddress}
                    onChange={(e) => updateFormData('smartContract', { policyAddress: e.target.value })}
                    disabled={formData.smartContract.isSubmitted}
                />
            </div>
            <button className="btn btn-secondary mt-2" onClick={validatePolicy} disabled={isProcessing || formData.smartContract.isSubmitted}>
                Validate Policy
            </button>
            {formData.smartContract.isValid !== null && (
                <p className="mt-3">{formData.smartContract.isValid ? 'Policy is valid' : 'Policy is not valid'}</p>
            )}

            <div className="form-group mt-4">
                <label>Condition Address:</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.smartContract.conditionAddress}
                    onChange={(e) => updateFormData('smartContract', { conditionAddress: e.target.value })}
                    disabled={formData.smartContract.isSubmitted}
                />
            </div>
            <button className="btn btn-danger mt-2" onClick={fileClaim} disabled={isProcessing || formData.smartContract.isSubmitted}>
                File Claim
            </button>
        </div>
    );
};

export default SmartContract;
