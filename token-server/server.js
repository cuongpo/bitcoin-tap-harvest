require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const rateLimit = require('express-rate-limit');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many token claims from this IP, please try again later'
});

// Apply rate limiting to token claim endpoint
app.use('/api/claim-tokens', limiter);

// Token contract details
const TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)"
];
const TOKEN_ADDRESS = "0xcaFDEE6D248a7e0AD9252Eae79F0EF5b8050Def1";

// Initialize blockchain connection
const provider = new ethers.providers.JsonRpcProvider("https://public-node.testnet.rsk.co");
let wallet, tokenContract;

// Initialize wallet and contract if private key is available
if (process.env.PRIVATE_KEY) {
  wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, wallet);
  console.log(`Server wallet initialized: ${wallet.address}`);
} else {
  console.error('PRIVATE_KEY not found in environment variables');
}

// Endpoint to claim tokens
app.post('/api/claim-tokens', async (req, res) => {
  try {
    const { playerAddress, amount, gameId, timestamp } = req.body;
    
    // Validate request
    if (!playerAddress || !amount || !gameId) {
      return res.status(400).json({ success: false, message: 'Missing required parameters' });
    }
    
    if (!ethers.utils.isAddress(playerAddress)) {
      return res.status(400).json({ success: false, message: 'Invalid player address' });
    }
    
    if (amount <= 0 || amount > 1000000) { // Set a reasonable max claim amount
      return res.status(400).json({ success: false, message: 'Invalid claim amount' });
    }
    
    if (!wallet || !tokenContract) {
      return res.status(500).json({ success: false, message: 'Server wallet not initialized' });
    }
    
    // Check server wallet balance
    const balance = await tokenContract.balanceOf(wallet.address);
    const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);
    
    if (balance.lt(amountInWei)) {
      return res.status(500).json({ success: false, message: 'Insufficient tokens in server wallet' });
    }
    
    // In a production environment, you would:
    // 1. Verify that the player has actually earned these tokens in your game
    // 2. Check if they've already claimed these tokens
    // 3. Store claim history in a database
    // 4. Implement proper authentication
    
    console.log(`Processing token transfer: ${amount} BGA to ${playerAddress}`);
    
    // Execute the token transfer
    const tx = await tokenContract.transfer(playerAddress, amountInWei);
    await tx.wait();
    
    console.log(`Transfer successful! Transaction hash: ${tx.hash}`);
    
    // Return success response with transaction details
    return res.json({
      success: true,
      message: 'Tokens claimed successfully',
      txHash: tx.hash,
      amount: amount,
      timestamp: Date.now()
    });
    
  } catch (error) {
    console.error('Error processing token claim:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing token claim',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    serverAddress: wallet ? wallet.address : 'not initialized'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Token server running on port ${PORT}`);
});
