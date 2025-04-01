
import React, { useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import CoinClicker from '@/components/CoinClicker';
import TokenDisplay from '@/components/TokenDisplay';
import UpgradeList from '@/components/UpgradeList';
import Stats from '@/components/Stats';
import MouseTrail from '@/components/MouseTrail';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { gameState, clickBitcoin, buyUpgrade, resetGame } = useGameState();
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
  
  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 pb-16">
      <MouseTrail />
      
      <h1 className="text-3xl sm:text-4xl font-bold my-6 text-center text-bitcoin">
        Bitcoin Clicker
      </h1>
      
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="p-6 bg-card/90 backdrop-blur">
              <TokenDisplay 
                tokens={Math.floor(gameState.tokens)} 
                tokensPerSecond={gameState.tokensPerSecond} 
                tokensPerClick={gameState.tokensPerClick} 
              />
              
              <CoinClicker onClick={clickBitcoin} size={160} />
              
              <div className="text-center mt-4 text-sm text-muted-foreground">
                Click the coin to earn tokens!
              </div>
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <Card className="p-4 h-full bg-card/90 backdrop-blur">
              <UpgradeList 
                upgrades={gameState.upgrades} 
                tokens={gameState.tokens} 
                onBuyUpgrade={buyUpgrade} 
              />
              
              <Separator className="my-4" />
              
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
