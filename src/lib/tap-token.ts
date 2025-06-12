import { getContract } from "thirdweb";
import { client, cotiTestnet } from "./thirdweb";

// TAP TOKEN Configuration
// Replace with your deployed contract address after deployment
export const TAP_TOKEN_ADDRESS = import.meta.env.VITE_TAP_TOKEN_ADDRESS || "0xC2fd91db1bF0c3062Ea086C4CBD4beEa1aF122D3";

// TAP TOKEN Contract instance
export const tapTokenContract = getContract({
  client,
  address: TAP_TOKEN_ADDRESS,
  chain: cotiTestnet,
});

// TAP TOKEN utilities - Updated with correct decimals from MCP
export const TAP_TOKEN_CONFIG = {
  name: "TAP TOKEN",
  symbol: "TAP",
  decimals: 6, // TAP token uses 6 decimals (confirmed from MCP response)
  // Conversion helpers
  toWei: (amount: string | number) => {
    return (BigInt(amount) * BigInt(10 ** 6)).toString();
  },
  fromWei: (amountWei: string | bigint) => {
    return Number(BigInt(amountWei) / BigInt(10 ** 6));
  },
  formatBalance: (amountWei: string | bigint) => {
    const amount = Number(BigInt(amountWei) / BigInt(10 ** 6));
    return amount.toLocaleString();
  }
};

// Game reward rates (points to TAP tokens)
export const REWARD_RATES = {
  // How many points needed for 1 TAP token
  POINTS_PER_TAP: 1000,
  
  // Bonus multipliers
  COMBO_BONUS: 1.5,
  CRITICAL_BONUS: 2.0,
  LEVEL_BONUS: 0.1, // 10% bonus per level
  
  // Daily limits
  MAX_DAILY_REWARDS: 100, // Max 100 TAP tokens per day
};

// Calculate TAP token rewards based on game points
export function calculateTapRewards(points: number, level: number, hasCombo: boolean, isCritical: boolean): number {
  let baseReward = points / REWARD_RATES.POINTS_PER_TAP;
  
  // Apply bonuses
  if (hasCombo) {
    baseReward *= REWARD_RATES.COMBO_BONUS;
  }
  
  if (isCritical) {
    baseReward *= REWARD_RATES.CRITICAL_BONUS;
  }
  
  // Level bonus
  baseReward *= (1 + (level * REWARD_RATES.LEVEL_BONUS));
  
  // Cap at daily limit
  return Math.min(baseReward, REWARD_RATES.MAX_DAILY_REWARDS);
}

// Validate TAP token address
export function isValidTapTokenAddress(): boolean {
  return TAP_TOKEN_ADDRESS !== "0x0000000000000000000000000000000000000000" && 
         TAP_TOKEN_ADDRESS.length === 42 && 
         TAP_TOKEN_ADDRESS.startsWith("0x");
}
