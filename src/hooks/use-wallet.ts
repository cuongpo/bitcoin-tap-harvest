import { useActiveAccount, useActiveWallet, useConnect, useDisconnect } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { client, cotiTestnet } from "@/lib/thirdweb";
import { useCallback } from "react";

export function useWallet() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const connectWallet = useCallback(async (walletId?: string) => {
    try {
      // Default to MetaMask, but allow other wallets
      const walletType = walletId || "io.metamask";
      const wallet = createWallet(walletType);

      // Connect to the wallet with COTI testnet
      await connect(async () => {
        await wallet.connect({
          client,
          chain: cotiTestnet,
        });
        return wallet;
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    }
  }, [connect]);

  const disconnectWallet = useCallback(async () => {
    try {
      if (wallet) {
        await disconnect(wallet);
      }
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
      throw error;
    }
  }, [disconnect, wallet]);

  const formatAddress = useCallback((address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  return {
    // Connection state
    isConnected: !!account,
    address: account?.address || "",
    formattedAddress: account?.address ? formatAddress(account.address) : "",
    
    // Connection methods
    connectWallet,
    disconnectWallet,
    
    // Wallet instance
    wallet,
    account,
  };
}
