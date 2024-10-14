# Insurance DApp

This project is a Decentralized Application (DApp) for an insurance management system built using Ethereum blockchain. The DApp allows users to interact with various contracts such as `PolicyHolder`, `Insurer`, `Term`, `Condition`, `InsuranceContract`, `SmartContract`, and `Blockchain` to carry out insurance-related processes in a decentralized manner.

## Prerequisites

Before running the project, ensure you have the following installed:
- **Node.js** (v14 or above)
- **npm** (Node Package Manager)
- **Truffle** (globally installed)
- **Ganache CLI** (for running a local Ethereum blockchain)

## Installation

Follow the steps below to set up the project and install the necessary packages:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/DevadattaP/insurance-dapp.git
    ```

2. **Install the required dependencies:**
    ```bash
    cd insurance-dapp/frontend
    npm install
    ```

3. **Install Truffle globally if not already installed:**
    ```bash
    npm install -g truffle
    ```

4. **Install Ganache CLI globally if not already installed:**
    ```bash
    npm install -g ganache-cli
    ```

5. **Install other libraries for rendering the DApp, and communication with blockchain, if not already installed:**
    ```bash
    npm install web3 react-router-dom bootstrap
    ```

## Blockchain initialization

To create blockchain using truffle and ganache, follow these steps:



## Running the Project

Follow these steps to run the project:

1. **Start Ganache CLI:**
    Run a local blockchain using Ganache CLI (from project root directory, `insurance-dapp`):
    ```bash
    npx ganache-cli --port 8545 --networkId 12345 --gasLimit 10000000
    ```
    This command will start a local Ethereum blockchain on port `8545` with a specified network ID and gas limit.

2. **Deploy Smart Contracts using Truffle:**
    Deploy the contracts to the local blockchain (from project root directory, `insurance-dapp`):
    ```bash
    npx truffle migrate --network development --reset
    ```
    This command will deploy the smart contracts to the blockchain network.

3. **Copy the files from `insurance-dapp/build/contracts` to `insurance-dapp/frontend/src/contracts`:-**
   Ensure you are in project root folder, `insurane-dapp`, and executefollowing command:
   ```bash
   cp -r build/contracts/* frontend/src/contracts/

   ```
4. **Copy `deployments.json` file from root folder to `frontend/src` folder:-**
   Ensure you are in project root folder, `insurane-dapp`, and executefollowing command:
   ```bash
   cp -r deployments.json frontend/src/

   ```
5. **Start the DApp:**
    Launch the DApp in your local development environment (from `frontend` directory):
    ```bash
    npm start
    ```
    The command will start the development server, and you can access the DApp at `http://localhost:3000`.

## File Structure

- `contracts/`: Contains the Solidity smart contracts for different entities.
- `migrations/`: Contains the migration scripts for deploying the contracts.
- `src/`: Contains the React front-end code for the DApp.
  - `components/`: Individual components for each contract interaction.
  - `contracts/`: Contains ABI files for deployed contracts in blockchain
  - `AppContext.js`: Context API for managing the state and interactions in the app.
  - `deployments.json`: Contains addresses of deployed contracts, created while initializing blockchain.
- `truffle-config.js`: Configuration file for Truffle.
- `genesis.json`: Contains configuration for genesis (first) block in the blockchain.

## Steps to Carry Out on the DApp UI

1. **Deploy the PolicyHolder Contract:**
   - Navigate to the **PolicyHolder** tab.
   - Enter a `Holder ID` and click on **Deploy PolicyHolder**.
   - Once deployed, click on **Apply for Insurance**.

2. **Deploy the Insurer Contract:**
   - Navigate to the **Insurer** tab.
   - Enter an `Insurer ID` and click on **Deploy Insurer**.
   - Once deployed, click on **Offer Insurance**.

3. **Deploy the Term Contract and Add Conditions:**
   - Navigate to the **Term** tab.
   - Enter a `Term ID` and `Term Type`, then click on **Deploy Term**.
   - Click on **Add Condition to Term** to link conditions with the term.

4. **Deploy the Condition Contract and Submit a Claim:**
   - Navigate to the **Condition** tab.
   - Enter a `Claim ID` and `Policy Number`, then click on **Deploy Condition**.
   - Click **Submit Claim** to submit the claim.

5. **Update the Status of the Claim:**
   - In the **Condition** tab, update the claim status by entering a new status and clicking **Update Status**.

6. **Deploy the Insurance Contract and Add Terms:**
   - Navigate to the **Insurance Contract** tab.
   - Enter a `Contract ID` and click **Deploy Insurance Contract**.
   - Click **Add Term** to link a term to the insurance contract.

7. **Sign the Insurance Contract:**
   - In the **Insurance Contract** tab, click **Sign Contract** to activate the insurance contract.

8. **Deploy the SmartContract and File a Claim:**
   - Navigate to the **SmartContract** tab.
   - Click **File Claim** to register the claim under the smart contract.

9. **Validate the Policy:**
   - In the **SmartContract** tab, click **Validate Policy** to check if the policy is valid.

10. **Execute a Payment:**
    - In the **SmartContract** tab, specify the recipient address and amount, then click **Execute Payment**.

11. **Validate the Blockchain:**
    - In the **Blockchain** tab, click **Validate Blockchain** to check the integrity of the blockchain.

## Smart contract without DApp:
To execute the smart contracts without DApp, you can run the `Extra/InsuranceSystem.sol` file in local blockchain, or you can execute it using Remix IDE. The steps and detailed explaination about contracts for the same are given in `Extra/Contract_functionality_workflow.pdf` file.

---
___

### Feel free to open issues or contribute to this project by making a pull request. Happy coding! 🚀
