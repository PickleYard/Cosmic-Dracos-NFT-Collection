#🐲 Cosmic Draco's NFT Generator DApp 🌌

Cosmic Draco's NFT Generator DApp is a decentralized application that leverages artificial intelligence to generate unique art pieces and mint them as Non-Fungible Tokens (NFTs) on the Ethereum blockchain.

## Technology Stack & Tools

- Solidity (Writing Smart Contracts & Tests)
- JavaScript (React & Testing)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ethers.js](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [React.js](https://reactjs.org/) (Frontend Framework)
- [NFT.Storage](https://nft.storage/) (Connection to IPFS)
- [Hugging Face](https://huggingface.co/) (AI Models)

## Requirements For Initial Setup

- Install [NodeJS](https://nodejs.org/en/)
- Install [MetaMask](https://metamask.io/) or similar Ethereum wallet in your browser.

## Setting Up

### 1. Clone/Download the Repository

You can clone the repository by using the following command in your terminal:

`git clone https://github.com/yourusername/ai-nft-generator.git`

Replace "yourusername" with your actual GitHub username.

### 2. Install Dependencies:

Navigate to the repository's root directory and run:

`$ npm install`

This will install all required dependencies for the project.

### 3. Setup .env file:

Before running any scripts, you'll want to create a .env file in the root of the project directory with the following values:

- **REACT_APP_NFT_STORAGE_API_KEY="your-nft-storage-api-key"**
- **REACT_APP_LEONARDO_API_KEY="your-leonardo-api-key"**

Replace "your-xxxx-api-key" with your respective API keys. 

For the Leonardo API key, you can get it by becoming a paid member through their Discord. From there you will need a paid subscription and can begin testing their API endpoints. [Leonardo dashboard](https://leonardo.ai/).

Also, create an account on [NFT.Storage](https://nft.storage/), and generate a new API key.

### 4. Run tests:

You can run tests using the following command:
`$ npx hardhat test`

### 5. Deploy Contracts:

After starting the hardhat node, you can deploy your contracts:

`$ npx hardhat run scripts/deploy.js --network localhost`

### 6. Start frontend:

Finally, you can start the frontend application with:
`$ npm run start`

This will launch the application in your default browser. Visit `localhost:3000` to interact with it.

# How to Use the App

### 1. Generating Art ✅

To start creating your own unique art, navigate to the main page of the application and click on the "Generate" button. This will prompt the AI to create a new, unique piece of art.

### 2. Connecting your Wallet ✅

To mint NFTs, you need to connect your Ethereum wallet to the application. Click on the "Connect" button located at the top-right of the navigation bar and approve the connection request in your wallet.

**⚠️Logging In vs Disconnecting:⚠️** 
When you connect your wallet, the application will remember your account even if you refresh the page. This is similar to logging in. To log out, you can disconnect your wallet from the application using the disconnect button in the dropdown menu under your account address in the navigation bar.

However, disconnecting from the application doesn't fully disconnect your wallet from the DApp. Your wallet might still remember that it gave this website permission to see your account address and prompt you to connect again without needing confirmation. To completely remove these permissions, you need to manually disconnect through MetaMask or use a tool like Revoke.cash.

### 3. Minting NFTs ✅

Once you have connected your wallet and generated an art piece that you like, you can mint it as an NFT by clicking on the "Mint" button. This will initiate a transaction that you need to approve in your wallet. Once the transaction is confirmed, you will be the owner of a new, unique NFT!

### 4. Viewing Your NFTs(COMING SOON...) ⭕

Before minting the NFT you will see a preview of the generated art and can adjust as needed before paying to mint an NFT.
Later on to view the NFTs you own, you can use an NFT marketplace that supports viewing NFTs, like OpenSea, IMX, the one I create, etc... 
You will need to connect your wallet to the marketplace so it can read the NFTs that you own.

Thank you for reading through and I hope you have as much fun as I did. 💻🎉
