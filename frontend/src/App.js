import React, { useState } from 'react';
import { AppProvider } from './AppContext';
import PolicyHolder from './components/PolicyHolder';
import Insurer from './components/Insurer';
import Term from './components/Term';
import Condition from './components/Condition';
import InsuranceContract from './components/InsuranceContract';
import SmartContract from './components/SmartContract';
import Blockchain from './components/Blockchain';

const App = () => {
    const [activeTab, setActiveTab] = useState('policyHolder');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'policyHolder':
                return <PolicyHolder goToTab={setActiveTab} />;
            case 'insurer':
                return <Insurer goToTab={setActiveTab} />;
            case 'term':
                return <Term goToTab={setActiveTab} />;
            case 'condition':
                return <Condition goToTab={setActiveTab} />;
            case 'insuranceContract':
                return <InsuranceContract goToTab={setActiveTab} />;
            case 'smartContract':
                return <SmartContract goToTab={setActiveTab} />;
            case 'blockchain':
                return <Blockchain goToTab={setActiveTab} />;
            default:
                return <PolicyHolder goToTab={setActiveTab} />;
        }
    };

    return (
        <AppProvider>
            <div className="container mt-4">
                <h1 className="text-center mb-4">Insurance DApp</h1>
                <nav className="nav nav-tabs justify-content-center">
                    <button className={`nav-link ${activeTab === 'policyHolder' ? 'active' : ''}`} onClick={() => setActiveTab('policyHolder')}>Policy Holder</button>
                    <button className={`nav-link ${activeTab === 'insurer' ? 'active' : ''}`} onClick={() => setActiveTab('insurer')}>Insurer</button>
                    <button className={`nav-link ${activeTab === 'term' ? 'active' : ''}`} onClick={() => setActiveTab('term')}>Term</button>
                    <button className={`nav-link ${activeTab === 'condition' ? 'active' : ''}`} onClick={() => setActiveTab('condition')}>Condition</button>
                    <button className={`nav-link ${activeTab === 'insuranceContract' ? 'active' : ''}`} onClick={() => setActiveTab('insuranceContract')}>Insurance Contract</button>
                    <button className={`nav-link ${activeTab === 'smartContract' ? 'active' : ''}`} onClick={() => setActiveTab('smartContract')}>Smart Contract</button>
                    <button className={`nav-link ${activeTab === 'blockchain' ? 'active' : ''}`} onClick={() => setActiveTab('blockchain')}>Blockchain</button>
                </nav>
                <div className="mt-4">
                    {renderTabContent()}
                </div>
            </div>
        </AppProvider>
    );
};

export default App;
