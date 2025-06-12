# Bitcoin Tap Harvest - COTI Edition Setup Guide

This guide will help you set up and run the Bitcoin Tap Harvest game with COTI blockchain integration.

## Quick Start

### 1. Install Dependencies

```bash
npm install
cd backend && npm install && cd ..
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Thirdweb client ID:

```env
VITE_THIRDWEB_CLIENT_ID=your-thirdweb-client-id-here
VITE_TAP_TOKEN_ADDRESS=0xC2fd91db1bF0c3062Ea086C4CBD4beEa1aF122D3
VITE_BACKEND_URL=http://localhost:3002
```

### 3. Get Thirdweb Client ID

1. Go to [thirdweb.com](https://thirdweb.com)
2. Create an account and new project
3. Copy your Client ID from the dashboard
4. Add it to your `.env` file

### 4. Start the Application

Option A - Start both frontend and backend together:
```bash
npm run start:all
```

Option B - Start them separately:
```bash
# Terminal 1 - Backend
npm run backend

# Terminal 2 - Frontend  
npm run dev
```

### 5. Access the Game

Open your browser and navigate to: http://localhost:5173

## How to Play

1. **Connect Wallet**: Click "Connect Wallet" to connect MetaMask to COTI Testnet
2. **Start Playing**: Click the Bitcoin coin to earn in-game tokens
3. **Buy Upgrades**: Purchase upgrades to increase your earning rate
4. **Convert Tokens**: Convert in-game tokens to claimable TAP tokens
5. **Claim Tokens**: Claim your TAP tokens to receive them on COTI blockchain

## COTI Testnet Configuration

The game automatically configures MetaMask for COTI Testnet:

- **Network Name**: COTI Testnet
- **Chain ID**: 7082400
- **RPC URL**: https://testnet.coti.io/rpc
- **Currency**: COTI
- **Block Explorer**: https://testnet.cotiscan.io

## TAP Token Details

- **Contract Address**: 0xC2fd91db1bF0c3062Ea086C4CBD4beEa1aF122D3
- **Symbol**: TAP
- **Decimals**: 6
- **Network**: COTI Testnet

## Troubleshooting

### Backend Connection Issues

If you see "Failed to connect to backend" errors:

1. Make sure the backend is running on port 3002
2. Check that CORS is properly configured
3. Verify the VITE_BACKEND_URL in your .env file

### Wallet Connection Issues

If MetaMask doesn't connect:

1. Make sure MetaMask is installed
2. Try refreshing the page
3. Check that you're on the correct network (COTI Testnet)

### Token Claiming Issues

If token claiming fails:

1. Ensure you have COTI tokens for gas fees
2. Check that the backend MCP service is running
3. Verify your wallet is connected to COTI Testnet

## Development

### Project Structure

```
bitcoin-tap-harvest/
├── src/                   # Frontend React app
│   ├── components/        # UI components
│   ├── hooks/             # Custom hooks (useWallet, useCotiMcp)
│   ├── lib/               # Blockchain config (thirdweb, tap-token)
│   └── pages/             # Page components
├── backend/               # COTI MCP backend
│   ├── server.js          # Express server with MCP integration
│   └── package.json       # Backend dependencies
└── .env                   # Environment configuration
```

### Key Technologies

- **Frontend**: React + TypeScript + Vite + thirdweb
- **Blockchain**: COTI Testnet + COTI MCP
- **Backend**: Node.js + Express + @modelcontextprotocol/sdk

### Available Scripts

- `npm run dev` - Start frontend development server
- `npm run backend` - Start backend MCP server
- `npm run start:all` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure both frontend and backend are running
4. Make sure you have COTI testnet tokens for gas fees

For more help, check the main README.md file or create an issue in the repository.
