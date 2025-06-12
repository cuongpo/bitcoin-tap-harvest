
import React from 'react';
import { formatNumber } from '@/lib/utils';
import { motion } from 'framer-motion';

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
    <div className="flex flex-col items-center space-y-3 mb-6">
      <div className="text-center">
        <motion.h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-bitcoin"
          animate={tokensPerSecond > 0 ? {
            scale: [1, 1.02, 1],
          } : {}}
          transition={{
            duration: 1,
            repeat: tokensPerSecond > 0 ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {formatNumber(tokens)}
        </motion.h1>
        <h2 className="text-lg sm:text-xl text-muted-foreground">tokens</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <div className="bg-muted/50 rounded-lg p-3 text-center border border-bitcoin/20">
          <div className="text-xs sm:text-sm text-muted-foreground mb-1">Per Click</div>
          <div className="text-lg sm:text-xl font-bold text-bitcoin">
            {formatNumber(tokensPerClick)}
          </div>
        </div>

        <motion.div
          className="bg-muted/50 rounded-lg p-3 text-center border border-bitcoin/20 relative"
          animate={tokensPerSecond > 0 ? {
            boxShadow: [
              "0 0 0 0 rgba(247, 147, 26, 0.4)",
              "0 0 0 10px rgba(247, 147, 26, 0)",
              "0 0 0 0 rgba(247, 147, 26, 0)"
            ]
          } : {}}
          transition={{
            duration: 2,
            repeat: tokensPerSecond > 0 ? Infinity : 0,
            ease: "easeOut"
          }}
        >
          <div className="text-xs sm:text-sm text-muted-foreground mb-1">Per Second</div>
          <div className="text-lg sm:text-xl font-bold text-bitcoin flex items-center justify-center gap-1">
            {formatNumber(tokensPerSecond)}
            {tokensPerSecond > 0 && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-bitcoin"
              >
                ⚡
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TokenDisplay;
