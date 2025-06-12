
import React from 'react';
import type { Upgrade } from '@/hooks/useGameState';
import UpgradeItem from './UpgradeItem';
import { ScrollArea } from '@/components/ui/scroll-area';

interface UpgradeListProps {
  upgrades: Upgrade[];
  tokens: number;
  onBuyUpgrade: (id: string) => void;
}

const UpgradeList: React.FC<UpgradeListProps> = ({ upgrades, tokens, onBuyUpgrade }) => {
  const sortedUpgrades = [...upgrades].sort((a, b) => {
    // Show affordable upgrades first
    const aAffordable = tokens >= a.cost ? 0 : 1;
    const bAffordable = tokens >= b.cost ? 0 : 1;
    
    if (aAffordable !== bAffordable) {
      return aAffordable - bAffordable;
    }
    
    // Then sort by cost
    return a.cost - b.cost;
  });
  
  return (
    <div className="w-full">
      <ScrollArea className="h-[calc(100vh-420px)] pr-2">
        <div className="space-y-3">
          {sortedUpgrades.map(upgrade => (
            <UpgradeItem
              key={upgrade.id}
              upgrade={upgrade}
              canAfford={tokens >= upgrade.cost}
              onBuy={() => onBuyUpgrade(upgrade.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UpgradeList;
