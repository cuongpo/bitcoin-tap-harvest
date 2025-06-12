# Bitcoin Game Token (BGA)

An ERC20 token for the Bitcoin Game project, deployed on Rootstock testnet.

## Token Details

- **Name**: Bitcoin Game
- **Symbol**: BGA
- **Total Supply**: 1,000,000,000 (1 billion) tokens
- **Decimals**: 18 (standard ERC20)

## Setup and Deployment

### Prerequisites

- Node.js and npm installed
- A wallet with RSK testnet RBTC for gas fees

### Installation

1. Clone this repository
2. Install dependencies:

```bash
cd token-contract
npm install
```

3. Create a `.env` file based on `.env.example` and add your private key:

```
PRIVATE_KEY=your_private_key_without_0x_prefix
```

### Getting RSK Testnet RBTC

Before deploying, you'll need some testnet RBTC for gas fees:

1. Create a wallet (e.g., using MetaMask)
2. Add Rootstock Testnet to your wallet:
   - Network Name: RSK Testnet
   - RPC URL: https://public-node.testnet.rsk.co
   - Chain ID: 31
   - Symbol: tRBTC
   - Block Explorer: https://explorer.testnet.rsk.co
3. Get testnet RBTC from the faucet: https://faucet.rsk.co/

### Compiling the Contract

```bash
npx hardhat compile
```

### Deploying to Rootstock Testnet

```bash
npx hardhat run scripts/deploy.js --network rsktestnet
```

After deployment, the script will output the token's contract address, which you can use to add the token to your wallet or verify on the RSK Testnet explorer.

## Interacting with the Token

Once deployed, you can interact with the token using:

- MetaMask or other wallets that support RSK Testnet
- The RSK Testnet explorer: https://explorer.testnet.rsk.co/
- Hardhat scripts for programmatic interactions

## Security Considerations

- Never commit your `.env` file with your private key
- The contract owner has all the initial tokens
- The contract uses OpenZeppelin's standard ERC20 implementation for security
