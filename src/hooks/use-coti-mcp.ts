/**
 * COTI MCP Hook for TAP Token Redemption
 *
 * This hook connects to the backend API for real COTI MCP integration.
 *
 * Backend API handles:
 * - MCP client connection
 * - Token minting via mint_private_erc20_token
 * - Balance checking
 * - Error handling
 */

import { useCallback, useState } from 'react';
import { useWallet } from './use-wallet';
import { TAP_TOKEN_ADDRESS, TAP_TOKEN_CONFIG } from '@/lib/tap-token';

// Backend API Configuration
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3003';

interface MintResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export function useCotiMcp() {
  const { isConnected, address } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const callBackendApi = useCallback(async (endpoint: string, data: any) => {
    try {
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Backend API call failed:`, error);
      throw error;
    }
  }, []);

  const mintTapTokens = useCallback(async (recipientAddress: string, tapTokenAmount: number): Promise<MintResult> => {
    if (!isConnected) {
      return { success: false, error: 'Wallet not connected' };
    }

    if (!TAP_TOKEN_ADDRESS || TAP_TOKEN_ADDRESS === "0x0000000000000000000000000000000000000000") {
      return { success: false, error: 'TAP token contract not configured' };
    }

    setIsLoading(true);

    try {
      console.log(`Minting ${tapTokenAmount} TAP tokens to ${recipientAddress}`);

      const result = await callBackendApi('/api/mint-tap-tokens', {
        recipientAddress,
        tapTokenAmount
      });

      console.log('Backend mint result:', result);

      if (result.success) {
        return {
          success: true,
          transactionHash: result.transactionHash
        };
      } else {
        return {
          success: false,
          error: result.error || 'Failed to mint tokens'
        };
      }

    } catch (error: any) {
      console.error('Failed to mint TAP tokens:', error);
      return {
        success: false,
        error: error.message || 'Failed to mint tokens'
      };
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, callBackendApi]);



  const getCotiBalance = useCallback(async (accountAddress: string): Promise<string> => {
    try {
      const result = await callBackendApi('/api/check-coti-balance', {
        accountAddress
      });

      return result.success ? result.balance : '0 COTI';
    } catch (error) {
      console.error('Failed to check COTI balance:', error);
      return '0 COTI';
    }
  }, [callBackendApi]);

  return {
    // State
    isLoading,
    isConnected,

    // Methods
    mintTapTokens,
    getCotiBalance,

    // Utils
    callBackendApi
  };
}
