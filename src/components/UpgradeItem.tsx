
import React from 'react';
import type { Upgrade } from '@/hooks/useGameState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CircuitBoard, Cpu, Activity, ServerCog, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  return (
    <div className={cn(
      "flex flex-col sm:flex-row items-start sm:items-center justify-between",
      "p-3 rounded-lg mb-2",
      "bg-card border border-border",
      "transition-all duration-200",
      canAfford ? "opacity-100" : "opacity-70"
    )}>
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 rounded-full p-2 bg-bitcoin/20">
          {iconMap[upgrade.id] || <CircuitBoard className="h-5 w-5" />}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-card-foreground">{upgrade.name}</h3>
            <Badge variant="outline" className="text-xs">Lvl {upgrade.level}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">{upgrade.description}</p>
          
          <div className="mt-1 text-xs text-bitcoin">
            {upgrade.type === 'click' 
              ? `+${upgrade.effect} tokens per click` 
              : `+${upgrade.effect} tokens per second`}
          </div>
        </div>
      </div>
      
      <div className="mt-2 sm:mt-0 w-full sm:w-auto">
        <Button 
          variant="outline" 
          size="sm"
          className={cn(
            "w-full sm:w-auto",
            canAfford ? "border-bitcoin/50 text-bitcoin hover:border-bitcoin hover:bg-bitcoin/10" : ""
          )}
          disabled={!canAfford}
          onClick={onBuy}
        >
          Buy: {upgrade.cost} tokens
        </Button>
      </div>
    </div>
  );
};

export default UpgradeItem;
