
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Bitcoin } from 'lucide-react';

interface CoinClickerProps {
  onClick: () => void;
  size?: number;
}

const CoinClicker = ({ onClick, size = 96 }: CoinClickerProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const coinRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const createTokenAnimation = useCallback((x: number, y: number) => {
    if (!containerRef.current) return;
    
    const token = document.createElement('div');
    token.innerText = '+1';
    token.classList.add('token-animation');
    token.style.left = `${x}px`;
    token.style.top = `${y}px`;
    
    containerRef.current.appendChild(token);
    
    // Remove the element after animation completes
    setTimeout(() => {
      if (token.parentNode === containerRef.current) {
        containerRef.current.removeChild(token);
      }
    }, 1500);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    onClick();
    
    const rect = coinRef.current?.getBoundingClientRect();
    if (rect) {
      // Calculate position relative to container
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (containerRect) {
        const relativeX = e.clientX - containerRect.left;
        const relativeY = e.clientY - containerRect.top;
        createTokenAnimation(relativeX, relativeY);
      }
    }
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 150);
  }, [isAnimating, onClick, createTokenAnimation]);

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-64"
    >
      <div 
        ref={coinRef}
        onClick={handleClick} 
        className={cn(
          "relative cursor-pointer rounded-full p-4",
          "bg-bitcoin hover:bg-bitcoin-light active:bg-bitcoin-dark",
          "transition-colors duration-150 shadow-lg",
          "animate-pulse-glow",
          isAnimating && "animate-coin-click"
        )}
        style={{ width: size, height: size }}
      >
        <Bitcoin 
          size={size - 32} 
          color="#ffffff" 
          className={cn(
            "absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2",
            "drop-shadow-lg"
          )}
        />
      </div>
    </div>
  );
};

export default CoinClicker;
