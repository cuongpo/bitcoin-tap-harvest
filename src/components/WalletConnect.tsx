import React, { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/use-wallet';
import { useCotiMcp } from '@/hooks/use-coti-mcp';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, Wallet } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

const WalletConnect: React.FC = () => {
  const {
    isConnected,
    address,
    formattedAddress,
    connectWallet,
    disconnectWallet
  } = useWallet();

  const { getCotiBalance } = useCotiMcp();
  const { toast } = useToast();

  const [isConnecting, setIsConnecting] = useState(false);
  const [cotiBalance, setCotiBalance] = useState<string>('0 COTI');

  // Fetch COTI balance when connected
  useEffect(() => {
    if (isConnected && address) {
      const fetchCotiBalance = async () => {
        try {
          const cotiBal = await getCotiBalance(address);
          setCotiBalance(cotiBal);
        } catch (error) {
          console.error('Failed to fetch COTI balance:', error);
        }
      };

      fetchCotiBalance();

      // Refresh balance every 30 seconds
      const interval = setInterval(fetchCotiBalance, 30000);
      return () => clearInterval(interval);
    }
  }, [isConnected, address, getCotiBalance]);

  const handleConnectWallet = async () => {
    if (isConnected) {
      try {
        await disconnectWallet();
        toast({
          title: "Wallet disconnected",
          description: "Successfully disconnected from COTI Testnet",
        });
      } catch (error) {
        console.error("Failed to disconnect wallet:", error);
        toast({
          title: "Error",
          description: "Failed to disconnect wallet",
          variant: "destructive",
        });
      }
      return;
    }

    setIsConnecting(true);
    try {
      await connectWallet();
      toast({
        title: "Wallet connected",
        description: "Successfully connected to COTI Testnet",
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet. Please make sure you have MetaMask installed and try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="p-4 mb-4 bg-card/90 backdrop-blur">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            COTI Testnet Wallet
          </h3>
          {isConnected && address ? (
            <>
              <div className="text-sm text-muted-foreground">
                Connected: {formattedAddress}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                COTI Balance: {cotiBalance}
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">
              Connect your wallet to play and claim TAP tokens on COTI Testnet
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleConnectWallet}
            variant={isConnected ? "outline" : "default"}
            disabled={isConnecting}
          >
            {isConnecting ? "Connecting..." : isConnected ? "Disconnect" : "Connect Wallet"}
          </Button>
        </div>
      </div>

      {!isConnected && (
        <Alert className="mt-3">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>COTI Testnet Required</AlertTitle>
          <AlertDescription>
            This game uses COTI Testnet. Your wallet will be automatically configured to connect to the correct network.
          </AlertDescription>
        </Alert>
      )}
    </Card>
  );
};

export default WalletConnect;
