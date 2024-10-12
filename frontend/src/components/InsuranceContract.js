import React, { useState, useContext } from 'react';
import { AppContext } from '../AppContext';
import Web3 from 'web3';
import InsuranceContractArtifact from '../contracts/InsuranceContract.json';

const InsuranceContract = ({ goToTab }) => {
    const { updateContract, contracts, formData, updateFormData } = useContext(AppContext); // Fetch context values
    const insuranceData = formData.insuranceContract;
    const [contractId, setContractId] = useState(insuranceData.contractId || '');
    const [isProcessing, setIsProcessing] = useState(false); // Track loading state

    const deployInsuranceContract = async () => {
        if (!contracts.policyHolder || !contracts.insurer) {
            alert('Please ensure both PolicyHolder and Insurer contracts are deployed first.');
            return;
        }

        setIsProcessing(true);
        const web3 = new Web3('http://127.0.0.1:8545');
        const accounts = await web3.eth.getAccounts();
        const instance = new web3.eth.Contract(InsuranceContractArtifact.abi);

        try {
            const result = await instance.deploy({
                data: InsuranceContractArtifact.bytecode,
                arguments: [contractId, contracts.policyHolder, contracts.insurer],
            }).send({
                from: accounts[0],
                gas: 3000000,
                gasPrice: web3.utils.toWei('20', 'gwei'),
            });

            updateContract('insuranceContract', result.options.address); // Update contract address in context
            updateFormData('insuranceContract', { contractId, isSubmitted: true }); // Update form data in context
            alert('InsuranceContract deployed successfully at address: ' + result.options.address);
            goToTab('term'); // Navigate to the Term tab
        } catch (error) {
            console.error('Error deploying InsuranceContract:', error);
            alert('Error deploying InsuranceContract: ' + error.message);
        }
        setIsProcessing(false);
    };

    const signContract = async () => {
        const insuranceContractAddress = contracts.insuranceContract;

        if (!insuranceContractAddress) {
            alert('InsuranceContract address not found. Make sure it is deployed and set correctly.');
            return;
        }

        const web3 = new Web3('http://127.0.0.1:8545');
        const accounts = await web3.eth.getAccounts();
        const instance = new web3.eth.Contract(InsuranceContractArtifact.abi, insuranceContractAddress);

        try {
            await instance.methods.signContract().send({ from: accounts[0], gas: 3000000, gasPrice: web3.utils.toWei('20', 'gwei') });
            updateFormData('insuranceContract', { contractId, isSubmitted: true }); // Update form data in context
            alert('Insurance Contract signed successfully');
        } catch (error) {
            console.error('Error signing Insurance Contract:', error);
            alert('Error signing Insurance Contract: ' + error.message);
        }
    };

    const addTerm = async () => {
        const termAddress = contracts.term;
        if (!termAddress || !termAddress.trim()) {
            alert('Please enter a valid Term Contract Address.');
            return;
        }

        const insuranceContractAddress = contracts.insuranceContract;

        if (!insuranceContractAddress) {
            alert('InsuranceContract address not found. Make sure it is deployed and set correctly.');
            return;
        }

        const web3 = new Web3('http://127.0.0.1:8545');
        const accounts = await web3.eth.getAccounts();
        const instance = new web3.eth.Contract(InsuranceContractArtifact.abi, insuranceContractAddress);
        
        try {
            await instance.methods.addTerm(termAddress).send({ from: accounts[0], gas: 3000000, gasPrice: web3.utils.toWei('20', 'gwei') });
            alert('Term added to Insurance Contract successfully');
        } catch (error) {
            console.error('Error adding term:', error);
            alert('Error adding term: ' + error.message);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Deploy Insurance Contract</h2>
            <div className="form-group">
                <label>Contract ID:</label>
                <input
                    type="text"
                    className="form-control"
                    value={contractId}
                    onChange={(e) => setContractId(e.target.value)}
                    disabled={insuranceData.isSubmitted || isProcessing} // Disable input after submission or during processing
                />
            </div>
            <button
                className="btn btn-primary mt-2"
                onClick={deployInsuranceContract}
                disabled={insuranceData.isSubmitted || isProcessing}
            >
                {isProcessing ? "Processing..." : (insuranceData.isSubmitted ? "Deployed" : "Deploy Insurance Contract")}
            </button>

            {insuranceData.isSubmitted && (
                <div className="mt-3">
                    <p>Insurance Contract Address: {contracts.insuranceContract}</p>
                </div>
            )}

            <div className="mt-4">
                <button
                    className="btn btn-secondary mt-2"
                    onClick={signContract}
                    disabled={!insuranceData.isSubmitted || isProcessing}
                >
                    Sign Contract
                </button>
                <button
                    className="btn btn-danger mt-2"
                    onClick={addTerm}
                    disabled={!insuranceData.isSubmitted || isProcessing}
                >
                    Add Term
                </button>
            </div>
        </div>
    );
};

export default InsuranceContract;
