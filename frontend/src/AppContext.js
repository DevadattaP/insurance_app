import React, { createContext, useState, useEffect } from 'react';
import deployments from './deployments.json'; // Assuming the JSON is in the src folder

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [contracts, setContracts] = useState({
        policyHolder: null,
        insurer: null,
        insuranceContract:null,
        term: null,
        condition: null,
        smartContract: deployments.smartContract || null,
        blockchain: deployments.blockchain || null,
    });

    const [formData, setFormData] = useState({
        policyHolder: { holderId: '', isSubmitted: false },
        insurer: { insurerId: '', isSubmitted: false },
        term: { termId: '', termType: '', isSubmitted: false },
        condition: { claimId: '', policyNumber: '', isSubmitted: false },
        insuranceContract: { contractId: '', isSubmitted: false },
        smartContract: { recipient: '', amount: '', policyAddress: '', conditionAddress: '', isSubmitted: false },
        blockchain: { latestBlockHash: '', isValid: null },
    });

    const updateContract = (contractName, address) => {
        setContracts(prev => ({ ...prev, [contractName]: address }));
    };

    const updateFormData = (tab, data) => {
        setFormData(prev => ({
            ...prev,
            [tab]: { ...prev[tab], ...data },
        }));
    };

    return (
        <AppContext.Provider value={{ contracts, updateContract, formData, updateFormData }}>
            {children}
        </AppContext.Provider>
    );
};
