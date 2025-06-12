import React, { useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useWallet } from '@/hooks/use-wallet';
import { useCotiMcp } from '@/hooks/use-coti-mcp';
import CoinClicker from '@/components/CoinClicker';
import TokenDisplay from '@/components/TokenDisplay';
import UpgradeList from '@/components/UpgradeList';
import Stats from '@/components/Stats';
import MouseTrail from '@/components/MouseTrail';
import WalletConnect from '@/components/WalletConnect';
import TokenConverter from '@/components/TokenConverter';
import TokenClaim from '@/components/TokenClaim';
import PassiveIncomeAnimation from '@/components/PassiveIncomeAnimation';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { gameState, clickBitcoin, buyUpgrade, resetGame, convertToClaimable, claimTokens } = useGameState();
  const { isConnected, address } = useWallet();
  const { mintTapTokens } = useCotiMcp();
  const { toast } = useToast();

  useEffect(() => {
    // Check if this is a returning player with offline progress
    const lastSaved = localStorage.getItem('btc-clicker-lastSaved');
    const now = Date.now();
    if (lastSaved) {
      const timeAway = (now - parseInt(lastSaved)) / 1000; // in seconds
      if (timeAway > 60 && gameState.tokensPerSecond > 0) {
        const earned = Math.floor(timeAway * gameState.tokensPerSecond);
        if (earned > 0) {
          toast({
            title: "Welcome back!",
            description: `You earned ${formatNumber(earned)} tokens while away.`,
            duration: 5000
          });
        }
      }
    }
    localStorage.setItem('btc-clicker-lastSaved', now.toString());
  }, []);

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  const handleConvertToClaimable = (amount: number) => {
    convertToClaimable(amount);
  };

  const handleClaimTokens = async () => {
    if (!isConnected || !address || gameState.claimableTokens <= 0) return;

    const amountToClaim = gameState.claimableTokens;

    try {
      const result = await mintTapTokens(address, amountToClaim);

      if (result.success) {
        // Update the game state to reflect the claimed tokens
        claimTokens(amountToClaim);
        toast({
          title: "Tokens claimed successfully!",
          description: `${amountToClaim} TAP tokens have been minted to your wallet.`,
        });
      } else {
        toast({
          title: "Claim failed",
          description: result.error || "Failed to claim tokens",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Token claim error:', error);
      toast({
        title: "Claim failed",
        description: "An error occurred while claiming tokens",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8 pb-16">
      <MouseTrail />

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold my-4 lg:my-6 text-center text-bitcoin">
        Bitcoin Tap Harvest - COTI Edition
      </h1>

      <div className="w-full max-w-[1600px]">
        {/* Wallet Connection */}
        <WalletConnect />

        <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-9 gap-4 lg:gap-6">
          {/* Game Area - Responsive sizing */}
          <div className="lg:col-span-3 xl:col-span-4 2xl:col-span-5">
            <Card className="p-4 sm:p-6 bg-card/90 backdrop-blur relative overflow-hidden">
              <TokenDisplay
                tokens={Math.floor(gameState.tokens)}
                tokensPerSecond={gameState.tokensPerSecond}
                tokensPerClick={gameState.tokensPerClick}
              />

              <CoinClicker
                onClick={clickBitcoin}
                tokensPerClick={gameState.tokensPerClick}
                size={160}
              />

              <div className="text-center mt-4 text-sm text-muted-foreground">
                Click the coin to earn tokens!
              </div>

              {/* Passive Income Animation */}
              <PassiveIncomeAnimation
                tokensPerSecond={gameState.tokensPerSecond}
                upgrades={gameState.upgrades}
              />
            </Card>

            {/* Token Conversion and Claiming */}
            <div className="mt-4 lg:mt-6">
              <TokenConverter
                gameTokens={Math.floor(gameState.tokens)}
                onConvert={handleConvertToClaimable}
              />

              <TokenClaim
                earnedTokens={Math.floor(gameState.claimableTokens)}
                onClaimSuccess={handleClaimTokens}
              />
            </div>
          </div>

          {/* Upgrades Section - Wider on larger screens */}
          <div className="lg:col-span-2 xl:col-span-3 2xl:col-span-4">
            <Card className="p-4 sm:p-6 h-full bg-card/90 backdrop-blur">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-center text-bitcoin">
                🚀 Upgrades & Stats
              </h2>

              <UpgradeList
                upgrades={gameState.upgrades}
                tokens={gameState.tokens}
                onBuyUpgrade={buyUpgrade}
              />

              <Separator className="my-4 lg:my-6" />

              <Stats
                totalEarned={gameState.totalTokensEarned}
                clicks={gameState.clicks}
                resetGame={resetGame}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
