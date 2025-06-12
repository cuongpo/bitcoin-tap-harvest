# Bitcoin Tap Harvest - COTI Edition

A Bitcoin-themed clicker game where players can earn TAP tokens on the COTI blockchain using COTI MCP (Model Context Protocol).

![Bitcoin Game](https://i.imgur.com/placeholder.png)

## Project Overview

Bitcoin Tap Harvest - COTI Edition is a play-to-earn blockchain game where players click on a Bitcoin to earn in-game tokens, purchase upgrades to increase their earnings, and claim real TAP tokens on the COTI blockchain using COTI MCP.

### Key Features

- **Bitcoin Clicker Game**: Click to earn tokens and buy upgrades
- **COTI Blockchain Integration**: Built on COTI Testnet with thirdweb SDK
- **COTI MCP Integration**: Uses Model Context Protocol for secure token minting
- **Wallet Connection**: Connect your MetaMask to COTI Testnet
- **Token Claiming**: Convert in-game tokens to real TAP tokens via MCP
- **Automatic Mining**: Purchase upgrades to earn tokens automatically
- **Offline Earnings**: Earn tokens even when you're not playing

## Table of Contents

- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Game Mechanics](#game-mechanics)
- [Blockchain Integration](#blockchain-integration)
- [Token Server](#token-server)
- [Deployment](#deployment)
- [Technologies Used](#technologies-used)

## Project Structure

The project consists of two main components:

1. **Game Client**: React-based frontend with COTI blockchain integration
2. **COTI MCP Backend**: Backend service for handling TAP token minting via MCP

```
bitcoin-tap-harvest/
├── src/                   # Game client source code
│   ├── components/        # React components
│   ├── hooks/             # Custom hooks (useWallet, useCotiMcp, useGameState)
│   ├── lib/               # Blockchain configuration (thirdweb, tap-token)
│   └── pages/             # Page components
├── backend/               # COTI MCP backend
│   ├── server.js          # Express server with MCP integration
│   └── package.json       # Backend dependencies
├── token-contract/        # Legacy ERC20 contract (for reference)
└── token-server/          # Legacy token server (for reference)
```

## Getting Started

### Prerequisites

- Node.js and npm
- MetaMask wallet
- Some COTI tokens for gas fees (automatically provided on testnet)

### Installation and Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd bitcoin-tap-harvest
```

2. **Install dependencies and start the game client**

```bash
npm install
cp .env.example .env
# Edit .env and add your Thirdweb client ID
npm run dev
```

3. **Configure and start the COTI MCP backend**

```bash
cd backend
npm install
npm start
```

4. **Access the game**

Open your browser and navigate to http://localhost:5173

5. **Connect to COTI Testnet**

- Click "Connect Wallet" in the game
- MetaMask will automatically configure COTI Testnet
- Start playing and earning TAP tokens!

## Game Mechanics

### Basic Gameplay

1. **Click the Bitcoin**: Each click earns you in-game tokens
2. **Buy Upgrades**: Spend tokens to increase your earnings
   - Click upgrades: Earn more tokens per click
   - Passive upgrades: Earn tokens automatically over time
3. **Convert Tokens**: Convert in-game tokens to claimable tokens
4. **Claim Tokens**: Claim your tokens to receive BGA tokens on the blockchain

### Upgrades

- **Better Mouse**: Increases tokens earned per click
- **Basic Miner**: Earns 0.1 tokens per second
- **GPU Miner**: Earns 1 token per second
- **Mining Farm**: Earns 8 tokens per second
- **Quantum Miner**: Earns 50 tokens per second

## COTI Blockchain Integration

### Wallet Connection

The game integrates with MetaMask using thirdweb SDK for COTI Testnet. Players can:

- Connect their wallet to COTI Testnet
- View their TAP token balance
- View their COTI balance
- Claim TAP tokens via COTI MCP

### TAP Token Contract

The TAP token is deployed on COTI Testnet and managed via COTI MCP:

- **Name**: TAP TOKEN
- **Symbol**: TAP
- **Decimals**: 6
- **Contract Address**: 0xC2fd91db1bF0c3062Ea086C4CBD4beEa1aF122D3
- **Network**: COTI Testnet (Chain ID: 7082400)

### COTI MCP Integration

COTI MCP (Model Context Protocol) provides secure token operations:

- **Minting**: `mint_private_erc20_token` for creating new TAP tokens
- **Balance Checking**: `get_private_erc20_balance` for checking TAP balances
- **Native Balance**: `get_native_balance` for checking COTI balances

### Token Claiming Process

1. Player earns in-game tokens by playing
2. Player converts in-game tokens to claimable tokens
3. Player claims tokens, which triggers a request to the MCP backend
4. MCP backend calls COTI MCP to mint TAP tokens
5. TAP tokens are minted directly to the player's wallet

## Token Server

The token server is a Node.js/Express application that handles the secure transfer of BGA tokens from the game wallet to players' wallets.

### Features

- **Secure Token Transfers**: Executes blockchain transactions to transfer tokens
- **Rate Limiting**: Prevents abuse by limiting claim requests
- **Validation**: Validates player addresses and claim amounts
- **Error Handling**: Provides clear error messages for failed claims

### Configuration

The token server requires a `.env` file with the following variables:

```
PORT=3001
PRIVATE_KEY=your_private_key_here_without_0x_prefix
```

**IMPORTANT**: The private key should belong to a wallet that holds BGA tokens. This wallet will be used to transfer tokens to players. Never commit your actual private key to version control.

## Deployment

### Game Client

The game client can be deployed to any static hosting service (Vercel, Netlify, etc.):

```bash
npm run build
# Deploy the 'dist' directory to your hosting service
```

### Token Server

The token server should be deployed to a secure server environment:

1. Set up a Node.js environment on your server
2. Configure environment variables
3. Install dependencies: `npm install --production`
4. Start the server: `node server.js`

Consider using PM2 or a similar process manager for production deployments.

## Technologies Used

### Frontend
- Vite
- React
- TypeScript
- shadcn-ui
- Tailwind CSS
- thirdweb SDK (for COTI blockchain interactions)

### Blockchain
- COTI Testnet (Layer 1 blockchain)
- COTI MCP (Model Context Protocol)
- TAP Token (ERC20 on COTI)

### Backend
- Node.js
- Express
- @modelcontextprotocol/sdk (for COTI MCP integration)
- cors (for cross-origin requests)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenZeppelin for their secure contract implementations
- Rootstock for their Bitcoin-compatible smart contract platform
