import React, { useContext, useState } from 'react';
import { AppContext } from '../AppContext';
import Web3 from 'web3';
import TermContract from '../contracts/Term.json';

const Term = ({ goToTab }) => {
    const { contracts, formData, updateFormData, updateContract } = useContext(AppContext);
    const [isProcessing, setIsProcessing] = useState(false);

    const deployTerm = async () => {
        const termData = formData.term;
        if (!termData.termId || !termData.termType) {
            alert('Please fill in both Term ID and Term Type.');
            return;
        }

        setIsProcessing(true);
        const web3 = new Web3('http://127.0.0.1:8545');
        const accounts = await web3.eth.getAccounts();

        const instance = new web3.eth.Contract(TermContract.abi);
        try {
            const result = await instance.deploy({
                data: TermContract.bytecode,
                arguments: [termData.termId, termData.termType],
            }).send({
                from: accounts[0],
                gas: 3000000,
                gasPrice: web3.utils.toWei('20', 'gwei'),
            });

            updateContract('term', result.options.address); // Update the term contract address in context
            updateFormData('term', { isSubmitted: true }); // Mark form data as submitted
            alert('Term deployed successfully at address: ' + result.options.address);
            goToTab('condition'); // Navigate to the Condition tab automatically
        } catch (error) {
            console.error('Error deploying Term:', error);
            alert('Error deploying Term: ' + error.message);
        }
        setIsProcessing(false);
    };

    const addCondition = async () => {
        const termAddress = contracts.term;
        const conditionAddress = contracts.condition;

        if (!termAddress) {
            alert('Term address not found. Make sure it is deployed first.');
            return;
        }

        if (!conditionAddress) {
            alert('Condition address not found. Please deploy a Condition contract first.');
            return;
        }

        const web3 = new Web3('http://127.0.0.1:8545');
        const accounts = await web3.eth.getAccounts();
        const instance = new web3.eth.Contract(TermContract.abi, termAddress);

        try {
            await instance.methods.addCondition(conditionAddress).send({
                from: accounts[0],
                gas: 3000000,
                gasPrice: web3.utils.toWei('20', 'gwei'),
            });
            alert('Condition added to Term successfully');
        } catch (error) {
            console.error('Error adding condition:', error);
            alert('Error adding condition: ' + error.message);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Deploy Term Contract</h2>
            <div className="form-group">
                <label>Term ID:</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.term.termId}
                    onChange={(e) => updateFormData('term', { termId: e.target.value })}
                    disabled={formData.term.isSubmitted || isProcessing}
                />
            </div>
            <div className="form-group">
                <label>Term Type:</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.term.termType}
                    onChange={(e) => updateFormData('term', { termType: e.target.value })}
                    disabled={formData.term.isSubmitted || isProcessing}
                />
            </div>
            <button
                className="btn btn-primary mt-2"
                onClick={deployTerm}
                disabled={formData.term.isSubmitted || isProcessing}
            >
                {isProcessing ? "Deploying..." : (formData.term.isSubmitted ? "Deployed" : "Deploy Term")}
            </button>
            <div className="mt-4">
                <button
                    className="btn btn-secondary mt-2"
                    onClick={addCondition}
                    disabled={!formData.term.isSubmitted || isProcessing}
                >
                    Add Condition to Term
                </button>
            </div>
        </div>
    );
};

export default Term;
