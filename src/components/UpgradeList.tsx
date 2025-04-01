
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
    <div className="mt-4 w-full">
      <h2 className="text-xl font-semibold mb-3">Upgrades</h2>
      <ScrollArea className="h-[calc(100vh-380px)] pr-4">
        <div className="space-y-2">
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
