const Blockchain = artifacts.require("Blockchain");
const InsuranceContract = artifacts.require("InsuranceContract");
const PolicyHolder = artifacts.require("PolicyHolder");
const Insurer = artifacts.require("Insurer");
const Term = artifacts.require("Term");
const Condition = artifacts.require("Condition");
const SmartContract = artifacts.require("SmartContract");
const fs = require('fs'); // Importing fs to write to a file

module.exports = async function (deployer) {
    // Deploy contracts in the desired order
    await deployer.deploy(PolicyHolder, "PH1"); // Deploy PolicyHolder first
    const policyHolder = await PolicyHolder.deployed(); // Get the instance of the deployed PolicyHolder

    await deployer.deploy(Insurer, "INS1"); // Deploy Insurer next
    const insurer = await Insurer.deployed(); // Get the instance of the deployed Insurer

    await deployer.deploy(Term, "T1", "Health"); // Deploy Term contract
    const term = await Term.deployed(); // Get the instance of the deployed Term

    await deployer.deploy(Condition, 1, "POL123"); // Deploy Condition contract
    const condition = await Condition.deployed(); // Get the instance of the deployed Condition

    // Deploy InsuranceContract with the required arguments
    await deployer.deploy(InsuranceContract, "INS-CONTRACT-001", policyHolder.address, insurer.address);
    const insuranceContract = await InsuranceContract.deployed(); // Get the instance of the deployed InsuranceContract

    await deployer.deploy(SmartContract, deployer.networks.development.from); // Deploy SmartContract
    const smartContract = await SmartContract.deployed(); // Get the instance of the deployed SmartContract

    await deployer.deploy(Blockchain); // Finally, deploy the Blockchain contract
    const blockchain = await Blockchain.deployed(); // Get the instance of the deployed Blockchain

    // Optionally: log the addresses of the deployed contracts
    console.log("Deployed Contracts:");
    console.log("PolicyHolder Address:", policyHolder.address);
    console.log("Insurer Address:", insurer.address);
    console.log("Term Address:", term.address);
    console.log("Condition Address:", condition.address);
    console.log("InsuranceContract Address:", insuranceContract.address);
    console.log("SmartContract Address:", smartContract.address);
    console.log("Blockchain Address:", blockchain.address);

    // Save deployed contract addresses to a JSON file
    const addresses = {
        policyHolder: policyHolder.address,
        insurer: insurer.address,
        term: term.address,
        condition: condition.address,
        insuranceContract: insuranceContract.address,
        smartContract: smartContract.address,
        blockchain: blockchain.address,
    };

    fs.writeFileSync('deployments.json', JSON.stringify(addresses, null, 2), 'utf-8');
    console.log('Deployed contract addresses saved to deployments.json');
};
