
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Bitcoin } from 'lucide-react';
import { motion } from 'framer-motion';
import ClickAnimation, { ClickAnimationRef } from './ClickAnimation';

interface CoinClickerProps {
  onClick: () => void;
  tokensPerClick: number;
  size?: number;
}

const CoinClicker = ({ onClick, tokensPerClick, size = 96 }: CoinClickerProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const coinRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const clickAnimationRef = useRef<ClickAnimationRef>(null);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isAnimating) return;

    setIsAnimating(true);
    onClick();

    // Trigger click animation
    if (clickAnimationRef.current) {
      const rect = coinRef.current?.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();

      if (rect && containerRect) {
        const relativeX = e.clientX - containerRect.left;
        const relativeY = e.clientY - containerRect.top;
        clickAnimationRef.current.triggerAnimation(relativeX, relativeY);
      }
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 150);
  }, [isAnimating, onClick]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-64"
    >
      <motion.div
        ref={coinRef}
        onClick={handleClick}
        className={cn(
          "relative cursor-pointer rounded-full p-4",
          "bg-bitcoin hover:bg-bitcoin-light active:bg-bitcoin-dark",
          "transition-all duration-150 shadow-lg",
          !isAnimating && "animate-pulse-glow hover:shadow-bitcoin/50 hover:shadow-2xl",
          isAnimating && "shadow-bitcoin/70 shadow-2xl"
        )}
        style={{ width: size, height: size }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isAnimating ? {
          scale: [1, 1.1, 1],
          rotate: [0, -5, 5, 0]
        } : {}}
        transition={{
          duration: 0.15,
          ease: "easeOut"
        }}
      >
        <Bitcoin
          size={size - 32}
          color="#ffffff"
          className={cn(
            "absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2",
            "drop-shadow-lg"
          )}
        />
      </motion.div>

      {/* Click Animation Component */}
      <ClickAnimation
        ref={clickAnimationRef}
        tokensPerClick={tokensPerClick}
      />
    </div>
  );
};

export default CoinClicker;
