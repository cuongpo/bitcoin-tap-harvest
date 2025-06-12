
import React from 'react';
import { formatNumber } from '@/lib/utils';

interface StatsProps {
  totalEarned: number;
  clicks: number;
  resetGame: () => void;
}

const Stats: React.FC<StatsProps> = ({ totalEarned, clicks, resetGame }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center">Game Statistics</h3>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-bitcoin">{formatNumber(totalEarned)}</div>
          <div className="text-sm text-muted-foreground">Total Tokens Earned</div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">{formatNumber(clicks)}</div>
          <div className="text-sm text-muted-foreground">Total Clicks</div>
        </div>
      </div>

      <button
        onClick={() => {
          const confirmed = window.confirm("Are you sure you want to reset your game? All progress will be lost.");
          if (confirmed) resetGame();
        }}
        className="w-full mt-4 text-sm text-destructive hover:underline py-2 border border-destructive/20 rounded-lg hover:bg-destructive/10 transition-colors"
      >
        Reset Game
      </button>
    </div>
  );
};

export default Stats;
