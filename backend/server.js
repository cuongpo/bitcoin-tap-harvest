/**
 * Backend API for COTI MCP Integration
 * This server handles MCP calls for TAP token minting
 */

import express from 'express';
import cors from 'cors';
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://localhost:5173',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:5173',
    'https://bitcoin-tap-harvest-frontend.onrender.com', // Add your frontend URL here
    /\.onrender\.com$/ // Allow all onrender.com subdomains
  ],
  credentials: true
}));
app.use(express.json());

// COTI MCP Configuration - Updated with your working API key
const SMITHERY_API_KEY = "36e96d01-a9dd-4e4c-a705-bbe239a712ea";
const COTI_MCP_CONFIG = {
  cotiMcpAesKey: "bd9e845a40c6d9d5993fe779219f06de",
  cotiMcpPrivateKey: "9aaf3492daad3ca9df711faebcdb482a64271ec1256c0501805871c92a85974e",
  cotiMcpPublicKey: "0x07d36857d6A48841193c131e735B24ADe93bDa37"
};

// Create MCP client using the working API key
async function createMcpClient() {
  const configBase64 = Buffer.from(JSON.stringify(COTI_MCP_CONFIG)).toString("base64");
  const serverUrl = `https://server.smithery.ai/@davibauer/coti-mcp/mcp?config=${encodeURIComponent(configBase64)}&api_key=${SMITHERY_API_KEY}`;

  console.log(`🔧 Creating MCP client with URL: ${serverUrl}`);

  const transport = new StreamableHTTPClientTransport(serverUrl);
  const client = new Client({
    name: "TAP Token Backend",
    version: "1.0.0"
  });

  await client.connect(transport);
  console.log(`✅ MCP client connected successfully`);

  return client;
}

// API Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'COTI MCP Backend is running' });
});

// Mint TAP tokens
app.post('/api/mint-tap-tokens', async (req, res) => {
  try {
    const { recipientAddress, tapTokenAmount } = req.body;

    if (!recipientAddress || !tapTokenAmount) {
      return res.status(400).json({
        success: false,
        error: 'Missing recipientAddress or tapTokenAmount'
      });
    }

    console.log(`Minting ${tapTokenAmount} TAP tokens to ${recipientAddress}`);

    // Create MCP client
    const client = await createMcpClient();

    // Convert TAP tokens to wei (multiply by 10^6 for TAP token decimals)
    const amountWei = (BigInt(tapTokenAmount) * BigInt(10 ** 6)).toString();

    // Call MCP mint function
    const result = await client.callTool({
      name: "mint_private_erc20_token",
      arguments: {
        token_address: "0xC2fd91db1bF0c3062Ea086C4CBD4beEa1aF122D3",
        recipient_address: recipientAddress,
        amount_wei: amountWei,
        gas_limit: "2000000"
      }
    });

    console.log('MCP mint result:', result);

    // Extract transaction hash
    let transactionHash = '';
    if (result && result.content && result.content[0] && result.content[0].text) {
      const resultText = result.content[0].text;
      const hashMatch = resultText.match(/Transaction Hash: (0x[a-fA-F0-9]{64})/);
      if (hashMatch) {
        transactionHash = hashMatch[1];
      }
    }

    res.json({
      success: true,
      transactionHash,
      result: result.content[0].text
    });

  } catch (error) {
    console.error('Mint failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to mint tokens'
    });
  }
});

// Check COTI balance
app.post('/api/check-coti-balance', async (req, res) => {
  try {
    const { accountAddress } = req.body;

    if (!accountAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing accountAddress'
      });
    }

    // Create MCP client
    const client = await createMcpClient();

    // Call MCP native balance check
    const result = await client.callTool({
      name: "get_native_balance",
      arguments: {
        account_address: accountAddress
      }
    });

    res.json({
      success: true,
      balance: result.content[0].text
    });

  } catch (error) {
    console.error('Balance check failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to check balance'
    });
  }
});

// Check TAP token balance
app.post('/api/check-tap-balance', async (req, res) => {
  try {
    const { accountAddress } = req.body;

    console.log(`🔍 Checking TAP balance for address: ${accountAddress}`);

    if (!accountAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing accountAddress'
      });
    }

    // Create MCP client
    const client = await createMcpClient();

    // Call MCP balance check
    const result = await client.callTool({
      name: "get_private_erc20_balance",
      arguments: {
        token_address: "0xC2fd91db1bF0c3062Ea086C4CBD4beEa1aF122D3",
        account_address: accountAddress
      }
    });

    console.log('Raw MCP balance result:', result.content[0].text);

    const resultText = result.content[0].text;

    // Parse the MCP response - it returns already formatted balance!
    // Format: "Balance: 1000000.0\nDecimals: 6\nSymbol: TAP\nName: TAP TOKEN"

    let formattedBalance = '0';
    let decimals = 18;
    let symbol = 'TAP';
    let name = 'TAP TOKEN';

    // Extract balance (already formatted by ethers.formatUnits in MCP)
    if (resultText.includes('Balance:')) {
      const balanceMatch = resultText.match(/Balance:\s*([\d.]+)/);
      if (balanceMatch) {
        formattedBalance = balanceMatch[1];
      }
    }

    // Extract decimals
    if (resultText.includes('Decimals:')) {
      const decimalsMatch = resultText.match(/Decimals:\s*(\d+)/);
      if (decimalsMatch) {
        decimals = parseInt(decimalsMatch[1]);
      }
    }

    // Extract symbol
    if (resultText.includes('Symbol:')) {
      const symbolMatch = resultText.match(/Symbol:\s*(\w+)/);
      if (symbolMatch) {
        symbol = symbolMatch[1];
      }
    }

    // Extract name
    if (resultText.includes('Name:')) {
      const nameMatch = resultText.match(/Name:\s*(.+?)(?:\n|$)/);
      if (nameMatch) {
        name = nameMatch[1].trim();
      }
    }

    const balanceNumber = parseFloat(formattedBalance);

    console.log(`✅ Parsed balance: ${formattedBalance} ${symbol} (${decimals} decimals)`);

    // Check for unreasonably large balances and format appropriately
    let displayBalance;
    if (balanceNumber > 1e15) { // More than 1 quadrillion tokens
      console.warn(`⚠️  Very large balance detected: ${balanceNumber} ${symbol}`);
      console.warn(`⚠️  Address: ${accountAddress}`);
      console.warn(`⚠️  This might be a test/admin address with massive balance`);

      // Format large numbers with suffixes for readability
      if (balanceNumber > 1e24) {
        displayBalance = (balanceNumber / 1e24).toFixed(2) + "Y";
      } else if (balanceNumber > 1e21) {
        displayBalance = (balanceNumber / 1e21).toFixed(2) + "Z";
      } else if (balanceNumber > 1e18) {
        displayBalance = (balanceNumber / 1e18).toFixed(2) + "E";
      } else if (balanceNumber > 1e15) {
        displayBalance = (balanceNumber / 1e15).toFixed(2) + "P";
      } else {
        displayBalance = balanceNumber.toFixed(6);
      }
    } else {
      // Normal balance - show up to 6 decimal places
      displayBalance = balanceNumber.toFixed(6);
    }

    res.json({
      success: true,
      balance: displayBalance,
      balanceRaw: formattedBalance, // Original formatted balance from MCP
      decimals: decimals,
      symbol: symbol,
      name: name,
      rawResponse: resultText
    });

  } catch (error) {
    console.error('TAP balance check failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to check TAP balance'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 COTI MCP Backend running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  /health - Health check`);
  console.log(`   POST /api/mint-tap-tokens - Mint TAP tokens`);
  console.log(`   POST /api/check-coti-balance - Check COTI balance`);
  console.log(`   POST /api/check-tap-balance - Check TAP token balance`);
  console.log(`\n🎮 Frontend should connect to: http://localhost:${PORT}`);
});

export default app;
