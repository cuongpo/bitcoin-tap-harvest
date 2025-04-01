
import React from 'react';
import { formatNumber } from '@/lib/utils';

interface TokenDisplayProps {
  tokens: number;
  tokensPerSecond: number;
  tokensPerClick: number;
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({ 
  tokens,
  tokensPerSecond,
  tokensPerClick 
}) => {
  return (
    <div className="flex flex-col items-center space-y-2 mb-4">
      <h1 className="text-4xl font-bold text-bitcoin">
        {formatNumber(tokens)}
      </h1>
      <h2 className="text-xl text-gray-200">tokens</h2>
      
      <div className="flex flex-col items-center sm:flex-row sm:space-x-4 mt-2 text-gray-300">
        <div className="flex items-center text-sm">
          <span className="text-gray-400 mr-1">per click:</span> 
          <span className="font-bold text-bitcoin">{formatNumber(tokensPerClick)}</span>
        </div>
        
        <div className="flex items-center text-sm">
          <span className="text-gray-400 mr-1">per second:</span> 
          <span className="font-bold text-bitcoin">{formatNumber(tokensPerSecond)}</span>
        </div>
      </div>
    </div>
  );
};

export default TokenDisplay;
