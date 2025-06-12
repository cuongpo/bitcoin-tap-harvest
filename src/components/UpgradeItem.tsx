
import React from 'react';
import type { Upgrade } from '@/hooks/useGameState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CircuitBoard, Cpu, Activity, ServerCog, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface UpgradeItemProps {
  upgrade: Upgrade;
  canAfford: boolean;
  onBuy: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  click_power: <Gauge className="h-5 w-5" />,
  basic_miner: <CircuitBoard className="h-5 w-5" />,
  gpu_miner: <Cpu className="h-5 w-5" />,
  mining_farm: <ServerCog className="h-5 w-5" />,
  quantum_miner: <Activity className="h-5 w-5" />,
};

const UpgradeItem: React.FC<UpgradeItemProps> = ({ upgrade, canAfford, onBuy }) => {
  const isActivePassive = upgrade.type === 'passive' && upgrade.level > 0;

  return (
    <motion.div
      className={cn(
        "flex flex-col lg:flex-row items-start lg:items-center justify-between",
        "p-4 rounded-lg border",
        "bg-gradient-to-r from-card to-card/80 border-border",
        "transition-all duration-200 hover:shadow-md",
        canAfford ? "opacity-100 hover:border-bitcoin/30" : "opacity-70",
        isActivePassive && "border-bitcoin/40 bg-gradient-to-r from-bitcoin/5 to-card/80"
      )}
      animate={isActivePassive ? {
        boxShadow: [
          "0 0 0 0 rgba(247, 147, 26, 0.2)",
          "0 0 0 4px rgba(247, 147, 26, 0)",
          "0 0 0 0 rgba(247, 147, 26, 0)"
        ]
      } : {}}
      transition={{
        duration: 3,
        repeat: isActivePassive ? Infinity : 0,
        ease: "easeOut"
      }}
    >
      <div className="flex items-start lg:items-center space-x-4 flex-1">
        <motion.div
          className="flex-shrink-0 rounded-full p-3 bg-bitcoin/20 border border-bitcoin/30 relative"
          animate={isActivePassive ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{
            duration: 2,
            repeat: isActivePassive ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {iconMap[upgrade.id] || <CircuitBoard className="h-6 w-6 text-bitcoin" />}
          {isActivePassive && (
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-card-foreground text-sm lg:text-base">{upgrade.name}</h3>
            <Badge variant="outline" className="text-xs bg-bitcoin/10 text-bitcoin border-bitcoin/30">
              Level {upgrade.level}
            </Badge>
          </div>
          <p className="text-xs lg:text-sm text-muted-foreground mb-2">{upgrade.description}</p>

          <div className="text-xs lg:text-sm font-medium text-bitcoin">
            {upgrade.type === 'click'
              ? `+${upgrade.effect.toLocaleString()} tokens per click`
              : `+${upgrade.effect.toLocaleString()} tokens per second`}
            {isActivePassive && (
              <span className="ml-2 text-green-600 font-bold">
                (Currently: +{(upgrade.effect * upgrade.level).toLocaleString()}/s)
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 lg:mt-0 w-full lg:w-auto lg:ml-4">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "w-full lg:w-auto lg:min-w-[140px] font-medium",
            canAfford
              ? "border-bitcoin/50 text-bitcoin hover:border-bitcoin hover:bg-bitcoin/10 hover:scale-105"
              : "opacity-50"
          )}
          disabled={!canAfford}
          onClick={onBuy}
        >
          Buy: {upgrade.cost.toLocaleString()}
        </Button>
      </div>
    </motion.div>
  );
};

export default UpgradeItem;
