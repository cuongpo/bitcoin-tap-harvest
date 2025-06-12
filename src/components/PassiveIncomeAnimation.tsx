import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Zap, CircuitBoard, Cpu, ServerCog, Activity } from 'lucide-react';

interface FloatingToken {
  id: string;
  amount: number;
  source: string;
  x: number;
  y: number;
  icon: React.ReactNode;
}

interface PassiveIncomeAnimationProps {
  tokensPerSecond: number;
  upgrades: Array<{
    id: string;
    name: string;
    level: number;
    effect: number;
    type: 'click' | 'passive';
  }>;
}

const upgradeIcons: Record<string, React.ReactNode> = {
  basic_miner: <CircuitBoard className="h-4 w-4" />,
  gpu_miner: <Cpu className="h-4 w-4" />,
  mining_farm: <ServerCog className="h-4 w-4" />,
  quantum_miner: <Activity className="h-4 w-4" />,
};

const PassiveIncomeAnimation: React.FC<PassiveIncomeAnimationProps> = ({
  tokensPerSecond,
  upgrades
}) => {
  const [floatingTokens, setFloatingTokens] = useState<FloatingToken[]>([]);

  useEffect(() => {
    if (tokensPerSecond <= 0) return;

    const interval = setInterval(() => {
      // Get active passive upgrades
      const activeUpgrades = upgrades.filter(u => u.type === 'passive' && u.level > 0);

      if (activeUpgrades.length === 0) return;

      // Create floating tokens for the most significant upgrades only
      const significantUpgrades = activeUpgrades
        .filter(u => (u.effect * u.level) >= 0.1) // Only show upgrades generating at least 0.1 tokens/sec
        .slice(0, 3); // Limit to 3 upgrades to avoid clutter

      const newTokens: FloatingToken[] = significantUpgrades.map((upgrade, index) => {
        const tokensFromThisUpgrade = upgrade.effect * upgrade.level;

        return {
          id: `${upgrade.id}-${Date.now()}-${index}`,
          amount: tokensFromThisUpgrade,
          source: upgrade.name,
          x: Math.random() * 250 + 50, // Random position within the game area
          y: Math.random() * 80 + 180,
          icon: upgradeIcons[upgrade.id] || <Coins className="h-4 w-4" />
        };
      });

      if (newTokens.length > 0) {
        setFloatingTokens(prev => [...prev, ...newTokens]);
      }
    }, 2000); // Show animation every 2 seconds

    return () => clearInterval(interval);
  }, [tokensPerSecond, upgrades]);

  // Remove tokens after animation completes
  useEffect(() => {
    const cleanup = setTimeout(() => {
      setFloatingTokens(prev => prev.slice(-10)); // Keep only last 10 tokens
    }, 3000);

    return () => clearTimeout(cleanup);
  }, [floatingTokens]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {floatingTokens.map((token) => (
          <motion.div
            key={token.id}
            initial={{
              x: token.x,
              y: token.y,
              opacity: 0,
              scale: 0.5
            }}
            animate={{
              x: token.x + (Math.random() - 0.5) * 100,
              y: token.y - 150,
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1, 1, 0.8]
            }}
            exit={{
              opacity: 0,
              scale: 0
            }}
            transition={{
              duration: 2.5,
              ease: "easeOut"
            }}
            className="absolute flex items-center gap-1 bg-bitcoin/20 backdrop-blur-sm border border-bitcoin/30 rounded-full px-2 py-1 text-xs font-medium text-bitcoin shadow-lg"
            onAnimationComplete={() => {
              setFloatingTokens(prev => prev.filter(t => t.id !== token.id));
            }}
          >
            {token.icon}
            <span>+{token.amount.toFixed(2)}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default PassiveIncomeAnimation;
