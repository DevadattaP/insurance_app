import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../AppContext';
import Web3 from 'web3';
import BlockchainArtifact from '../contracts/Blockchain.json';

const Blockchain = ({ goToTab }) => {
    const { contracts, formData, updateFormData } = useContext(AppContext);
    const [isProcessing, setIsProcessing] = useState(false);

    // Load initial data from context
    useEffect(() => {
        const latestBlockHash = formData.blockchain.latestBlockHash || '';
        const isValid = formData.blockchain.isValid || null;

        // Only update if the values are different to avoid endless loops
        if (latestBlockHash !== formData.blockchain.latestBlockHash || isValid !== formData.blockchain.isValid) {
            updateFormData('blockchain', {
                latestBlockHash,
                isValid
            });
        }
    }, [contracts, formData.blockchain.latestBlockHash, formData.blockchain.isValid, updateFormData]);

    const addBlock = async () => {
        setIsProcessing(true); // Disable further submissions
        const web3 = new Web3('http://127.0.0.1:8545');
        const accounts = await web3.eth.getAccounts();
    
        const blockchainAddress = contracts.blockchain; // Fetch blockchain address from context
        if (!blockchainAddress) {
            alert('Blockchain contract address not found. Make sure it is deployed and set correctly.');
            setIsProcessing(false); // Re-enable if error occurs
            return;
        }
    
        const instance = new web3.eth.Contract(BlockchainArtifact.abi, blockchainAddress);
        let previousHash = '0x'+'0'.repeat(64); // Default for the first block
    
        try {
            // Get the length of the chain to determine the previous block's hash
            const chainLength = await instance.methods.chain().call();
            if (chainLength > 0) {
                const lastBlock = await instance.methods.chain(chainLength - 1).call();
                previousHash = lastBlock.blockHash; // Fetch the last block's hash
            }
    
            // Check if contracts.insuranceContract exists before adding it
            if (!contracts.insuranceContract) {
                alert('InsuranceContract address not found. Please deploy the contract first.');
                setIsProcessing(false); // Re-enable if error occurs
                return;
            }
    
            // Add the block to the blockchain
            const result = await instance.methods.addBlock([contracts.insuranceContract], previousHash)
                .send({ from: accounts[0], gas: 3000000, gasPrice: web3.utils.toWei('20', 'gwei') });
    
            alert('Block added to blockchain successfully');
            updateFormData('blockchain', { latestBlockHash: result.events.BlockAdded.returnValues.blockHash });
        } catch (error) {
            console.error('Error adding block:', error);
            alert('Error adding block: ' + error.message);
        } finally {
            setIsProcessing(false); // Re-enable after processing
        }
    };
    

    const validateChain = async () => {
        setIsProcessing(true); // Disable further submissions
        const web3 = new Web3('http://127.0.0.1:8545');
        const blockchainAddress = contracts.blockchain;

        if (!blockchainAddress) {
            alert('Blockchain contract address not found. Make sure it is deployed and set correctly.');
            setIsProcessing(false); // Reset loading state
            return;
        }

        const instance = new web3.eth.Contract(BlockchainArtifact.abi, blockchainAddress);

        try {
            const isValid = await instance.methods.validateChain().call();
            updateFormData('blockchain', { isValid });
            alert(isValid ? 'Blockchain is valid' : 'Blockchain is not valid');
        } catch (error) {
            console.error('Error validating blockchain:', error);
            alert('Error validating blockchain: ' + error.message);
        } finally {
            setIsProcessing(false); // Reset loading state
        }
    };

    return (
        <div className="container mt-4">
            <h2>Blockchain Operations</h2>
            <button className="btn btn-primary mt-2" onClick={addBlock} disabled={isProcessing}>
                {isProcessing ? "Adding Block..." : "Add Block to Blockchain"}
            </button>
            <button className="btn btn-secondary mt-2 ml-2" onClick={validateChain} disabled={isProcessing}>
                {isProcessing ? "Validating..." : "Validate Blockchain"}
            </button>
            {formData.blockchain.latestBlockHash && (
                <p className="mt-3">Latest Block Hash: {formData.blockchain.latestBlockHash}</p>
            )}
            {formData.blockchain.isValid !== null && (
                <p className="mt-3">{formData.blockchain.isValid ? 'Blockchain is valid' : 'Blockchain is not valid'}</p>
            )}
        </div>
    );
};

export default Blockchain;
