import React, { useContext, useState } from 'react';
import { AppContext } from '../AppContext';
import Web3 from 'web3';
import InsurerContract from '../contracts/Insurer.json';

const Insurer = ({ goToTab }) => {
    const { contracts, formData, updateFormData, updateContract } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const deployInsurer = async () => {
        if (!formData.insurer.insurerId) {
            alert('Insurer ID is required.');
            return;
        }

        setIsLoading(true); // Set loading state
        const web3 = new Web3('http://127.0.0.1:8545');
        const accounts = await web3.eth.getAccounts();

        const instance = new web3.eth.Contract(InsurerContract.abi);
        try {
            const result = await instance.deploy({
                data: InsurerContract.bytecode,
                arguments: [formData.insurer.insurerId],
            }).send({
                from: accounts[0],
                gas: 3000000,
                gasPrice: web3.utils.toWei('20', 'gwei'),
            });

            updateContract('insurer', result.options.address); // Update contracts context with the insurer address
            updateFormData('insurer', { isSubmitted: true }); // Mark form data as submitted
            alert('Insurer deployed successfully at address: ' + result.options.address);
            goToTab('term'); // Automatically navigate to the Term tab
        } catch (error) {
            console.error('Deployment error:', error);
            alert('Error deploying Insurer: ' + error.message);
        }
        setIsLoading(false); // Reset loading state
    };

    const offerInsurance = async () => {
        const web3 = new Web3('http://127.0.0.1:8545');
        const accounts = await web3.eth.getAccounts();
        const insurerAddress = contracts.insurer;

        if (!insurerAddress || !contracts.insuranceContract) {
            alert('Insurer or Insurance Contract address not found. Ensure they are deployed first.');
            return;
        }

        const instance = new web3.eth.Contract(InsurerContract.abi, insurerAddress);
        const insuranceContractAddress = contracts.insuranceContract;

        try {
            await instance.methods.offerInsurance(insuranceContractAddress).send({
                from: accounts[0],
                gas: 3000000,
                gasPrice: web3.utils.toWei('20', 'gwei'),
            });
            alert('Insurance offered successfully');
        } catch (error) {
            console.error('Offering error:', error);
            alert('Error offering insurance: ' + error.message);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Deploy Insurer Contract</h2>
            <div className="form-group">
                <label>Insurer ID:</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.insurer.insurerId}
                    onChange={(e) => updateFormData('insurer', { insurerId: e.target.value })} // Update insurerId in form data context
                    disabled={formData.insurer.isSubmitted || isLoading} // Disable input after submission or while loading
                />
            </div>
            <button
                className="btn btn-primary mt-2"
                onClick={deployInsurer}
                disabled={formData.insurer.isSubmitted || isLoading}
            >
                {isLoading ? 'Deploying...' : (formData.insurer.isSubmitted ? 'Deployed' : 'Deploy Insurer')}
            </button>
            <div className="mt-4">
                <button
                    className="btn btn-secondary mt-2"
                    onClick={offerInsurance}
                    disabled={!formData.insurer.isSubmitted || isLoading}
                >
                    Offer Insurance
                </button>
            </div>
        </div>
    );
};

export default Insurer;
