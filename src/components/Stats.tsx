
import React from 'react';
import { formatNumber } from '@/lib/utils';

interface StatsProps {
  totalEarned: number;
  clicks: number;
  resetGame: () => void;
}

const Stats: React.FC<StatsProps> = ({ totalEarned, clicks, resetGame }) => {
  return (
    <div className="mt-4 border-t border-muted pt-4">
      <h3 className="text-sm font-medium mb-2">Stats</h3>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-muted-foreground">Total Earned:</div>
        <div className="text-right">{formatNumber(totalEarned)}</div>
        
        <div className="text-muted-foreground">Total Clicks:</div>
        <div className="text-right">{formatNumber(clicks)}</div>
      </div>
      
      <button
        onClick={() => {
          const confirmed = window.confirm("Are you sure you want to reset your game? All progress will be lost.");
          if (confirmed) resetGame();
        }}
        className="mt-4 text-xs text-destructive hover:underline"
      >
        Reset Game
      </button>
    </div>
  );
};

export default Stats;
