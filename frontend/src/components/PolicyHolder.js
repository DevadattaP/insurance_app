import React, { useContext, useState } from 'react';
import { AppContext } from '../AppContext';
import Web3 from 'web3';
import PolicyHolderContract from '../contracts/PolicyHolder.json';

const PolicyHolder = ({ goToTab }) => {
    const { contracts, formData, updateFormData, updateContract } = useContext(AppContext);

    const [isLoading, setIsLoading] = useState(false); // New loading state

    const deployPolicyHolder = async () => {
        if (!formData.policyHolder.holderId) {
            alert('Holder ID is required.');
            return;
        }

        setIsLoading(true); // Set loading state
        const web3 = new Web3('http://127.0.0.1:8545');
        const accounts = await web3.eth.getAccounts();

        const instance = new web3.eth.Contract(PolicyHolderContract.abi);
        try {
            const result = await instance.deploy({
                data: PolicyHolderContract.bytecode,
                arguments: [formData.policyHolder.holderId],
            }).send({
                from: accounts[0],
                gas: 3000000,
                gasPrice: web3.utils.toWei('20', 'gwei'),
            });

            updateContract('policyHolder', result.options.address);
            updateFormData('policyHolder', { isSubmitted: true }); // Update submission status
            alert('PolicyHolder deployed successfully at address: ' + result.options.address);
            goToTab('insurer'); // Automatically navigate to the next tab
        } catch (error) {
            alert('Error deploying PolicyHolder: ' + error.message);
        }
        setIsLoading(false); // Reset loading state
    };

    const applyForInsurance = async () => {
        const web3 = new Web3('http://127.0.0.1:8545');
        const accounts = await web3.eth.getAccounts();
        const policyHolderAddress = contracts.policyHolder; // Use the deployed policy holder address
        const insuranceContractAddress = contracts.insuranceContract;

        if (!policyHolderAddress || !insuranceContractAddress) {
            alert('PolicyHolder or InsuranceContract address not found. Make sure they are deployed first.');
            return;
        }

        const instance = new web3.eth.Contract(PolicyHolderContract.abi, policyHolderAddress);
        try {
            await instance.methods.applyForInsurance(insuranceContractAddress).send({
                from: accounts[0],
                gas: 3000000,
                gasPrice: web3.utils.toWei('20', 'gwei'),
            });
            alert('Insurance applied successfully');
        } catch (error) {
            console.error('Application error:', error); // Log error to console
            alert('Error applying for insurance: ' + error.message);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Deploy PolicyHolder Contract</h2>
            <div className="form-group">
                <label>Holder ID:</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.policyHolder.holderId}
                    onChange={(e) => updateFormData('policyHolder', { holderId: e.target.value })}
                    disabled={formData.policyHolder.isSubmitted || isLoading} // Disable input field after submission or while loading
                />
            </div>
            <button
                className="btn btn-primary mt-2"
                onClick={deployPolicyHolder}
                disabled={formData.policyHolder.isSubmitted || isLoading}
            >
                {isLoading ? 'Deploying...' : (formData.policyHolder.isSubmitted ? 'Deployed' : 'Deploy PolicyHolder')}
            </button>
            <div className="mt-4">
                <button
                    className="btn btn-secondary mt-2"
                    onClick={applyForInsurance}
                    disabled={!formData.policyHolder.isSubmitted || isLoading}
                >
                    Apply for Insurance
                </button>
            </div>
        </div>
    );
};

export default PolicyHolder;
