import React, { useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Plus } from 'lucide-react';

interface ClickToken {
  id: string;
  amount: number;
  x: number;
  y: number;
  delay: number;
}

interface ClickRipple {
  id: string;
  x: number;
  y: number;
}

interface ClickAnimationProps {
  tokensPerClick: number;
}

export interface ClickAnimationRef {
  triggerAnimation: (x: number, y: number) => void;
}

const ClickAnimation = forwardRef<ClickAnimationRef, ClickAnimationProps>(({
  tokensPerClick
}, ref) => {
  const [clickTokens, setClickTokens] = useState<ClickToken[]>([]);
  const [clickRipples, setClickRipples] = useState<ClickRipple[]>([]);

  const triggerClickAnimation = useCallback((x: number, y: number) => {
    const timestamp = Date.now();

    // Create multiple floating points based on tokens per click
    const pointsToShow = Math.min(tokensPerClick, 10); // Cap at 10 points for performance
    const newTokens: ClickToken[] = [];

    for (let i = 0; i < pointsToShow; i++) {
      const newToken: ClickToken = {
        id: `click-${timestamp}-${i}`,
        amount: 1, // Each point represents 1 token
        x: x + (Math.random() - 0.5) * 40, // Spread points around click location
        y: y + (Math.random() - 0.5) * 20,
        delay: i * 0.05, // Stagger the animations slightly
      };
      newTokens.push(newToken);
    }

    // If tokens per click is more than points shown, create one summary token
    if (tokensPerClick > pointsToShow) {
      const summaryToken: ClickToken = {
        id: `click-summary-${timestamp}`,
        amount: tokensPerClick - pointsToShow,
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 20,
        delay: pointsToShow * 0.05,
      };
      newTokens.push(summaryToken);
    }

    // Create ripple effect
    const newRipple: ClickRipple = {
      id: `ripple-${timestamp}`,
      x: x,
      y: y,
    };

    setClickTokens(prev => [...prev, ...newTokens]);
    setClickRipples(prev => [...prev, newRipple]);

    // Remove tokens after animation
    setTimeout(() => {
      setClickTokens(prev => prev.filter(token => !token.id.includes(`click-${timestamp}`)));
    }, 1500);

    // Remove ripple after animation
    setTimeout(() => {
      setClickRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 800);
  }, [tokensPerClick]);

  // Expose the trigger function via ref
  useImperativeHandle(ref, () => ({
    triggerAnimation: triggerClickAnimation
  }), [triggerClickAnimation]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {/* Ripple Effects */}
        {clickRipples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{
              x: ripple.x - 25,
              y: ripple.y - 25,
              scale: 0,
              opacity: 0.8
            }}
            animate={{
              scale: [0, 1.5, 2],
              opacity: [0.8, 0.4, 0]
            }}
            exit={{
              opacity: 0
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut"
            }}
            className="absolute w-12 h-12 border-2 border-bitcoin/60 rounded-full"
          />
        ))}

        {/* Floating Points */}
        {clickTokens.map((token) => (
          <motion.div
            key={token.id}
            initial={{
              x: token.x - 15, // Center the animation
              y: token.y - 10,
              opacity: 0,
              scale: 0.3
            }}
            animate={{
              x: token.x - 15 + (Math.random() - 0.5) * 80,
              y: token.y - 60 - Math.random() * 40,
              opacity: [0, 1, 1, 0],
              scale: [0.3, 1, 1, 0.7],
              rotate: [0, (Math.random() - 0.5) * 20]
            }}
            exit={{
              opacity: 0,
              scale: 0
            }}
            transition={{
              duration: 1.2 + Math.random() * 0.6, // Vary duration for more natural feel
              ease: "easeOut",
              delay: token.delay // Stagger the animations
            }}
            className={`absolute flex items-center justify-center ${
              token.amount === 1
                ? "w-6 h-6 bg-bitcoin/40 border border-bitcoin/60 rounded-full text-xs font-bold text-bitcoin shadow-md"
                : "bg-bitcoin/30 backdrop-blur-sm border border-bitcoin/50 rounded-full px-2 py-1 text-sm font-bold text-bitcoin shadow-lg"
            }`}
          >
            {token.amount === 1 ? (
              <span>+1</span>
            ) : (
              <>
                <Plus className="h-3 w-3" />
                <span>{token.amount.toLocaleString()}</span>
              </>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});

ClickAnimation.displayName = 'ClickAnimation';

export default ClickAnimation;
