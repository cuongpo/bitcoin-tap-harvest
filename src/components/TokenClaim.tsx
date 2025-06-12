import React, { useState } from 'react';
import { useWallet } from '@/hooks/use-wallet';
import { useCotiMcp } from '@/hooks/use-coti-mcp';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface TokenClaimProps {
  earnedTokens: number;
  onClaimSuccess: () => void;
}

const TokenClaim: React.FC<TokenClaimProps> = ({ earnedTokens, onClaimSuccess }) => {
  const { isConnected, address } = useWallet();
  const { mintTapTokens, isLoading } = useCotiMcp();
  const [isClaiming, setIsClaiming] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<string>('');
  const { toast } = useToast();

  const handleClaim = async () => {
    if (!isConnected || !address || earnedTokens <= 0) return;

    setIsClaiming(true);
    try {
      const result = await mintTapTokens(address, earnedTokens);

      if (result.success) {
        let description = `Successfully minted ${earnedTokens.toLocaleString()} TAP tokens to your wallet.`;

        if (result.transactionHash) {
          const shortHash = `${result.transactionHash.slice(0, 10)}...${result.transactionHash.slice(-8)}`;
          description += ` Transaction: ${shortHash}`;

          // Store the transaction hash for display
          setLastTxHash(result.transactionHash);

          // Log the full transaction hash and explorer link for easy access
          console.log('🎉 TAP Tokens Claimed Successfully!');
          console.log('📝 Transaction Hash:', result.transactionHash);
          console.log('🔍 View on Explorer:', `https://testnet.cotiscan.io/tx/${result.transactionHash}`);
        }

        toast({
          title: "TAP Tokens Claimed!",
          description,
          duration: 8000
        });
        onClaimSuccess();
      } else {
        toast({
          title: "Claim Failed",
          description: result.error || "There was an error claiming your tokens. Please try again.",
          variant: "destructive",
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error claiming tokens:', error);
      toast({
        title: "Claim Failed",
        description: "There was an error claiming your tokens. Please try again.",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <Card className="p-4 mt-4 bg-card/90 backdrop-blur">
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">Claim Your TAP Tokens</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Convert your in-game tokens to TAP tokens on COTI blockchain
        </p>

        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-medium">Available to claim:</div>
            <div className="text-xl font-bold">{earnedTokens.toLocaleString()} TAP</div>
          </div>

          <Button
            onClick={handleClaim}
            disabled={!isConnected || earnedTokens <= 0 || isClaiming || isLoading}
            className="min-w-[120px]"
          >
            {(isClaiming || isLoading) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Minting...
              </>
            ) : (
              'Claim TAP Tokens'
            )}
          </Button>
        </div>

        {!isConnected && (
          <p className="text-sm text-muted-foreground mt-3">
            Connect your wallet to claim TAP tokens
          </p>
        )}

        {isConnected && (
          <p className="text-sm text-muted-foreground mt-3">
            TAP tokens will be minted directly to your wallet on COTI Testnet
          </p>
        )}

        {lastTxHash && (
          <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              Last Transaction:
            </p>
            <a
              href={`https://testnet.cotiscan.io/tx/${lastTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-600 dark:text-green-400 hover:underline break-all flex items-center gap-1"
            >
              {lastTxHash}
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TokenClaim;
