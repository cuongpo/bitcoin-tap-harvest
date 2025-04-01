
import { useState, useEffect } from 'react';

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  baseCost: number;
  level: number;
  effect: number;
  type: 'click' | 'passive';
  maxLevel?: number;
}

export interface GameState {
  tokens: number;
  tokensPerClick: number;
  tokensPerSecond: number;
  totalTokensEarned: number;
  clicks: number;
  lastSaved: number;
  upgrades: Upgrade[];
}

const defaultUpgrades: Upgrade[] = [
  {
    id: 'click_power',
    name: 'Better Mouse',
    description: 'Earn more tokens per click',
    baseCost: 10,
    cost: 10,
    level: 1,
    effect: 1,
    type: 'click'
  },
  {
    id: 'basic_miner',
    name: 'Basic Miner',
    description: 'A simple mining rig that earns tokens automatically',
    baseCost: 15,
    cost: 15,
    level: 0,
    effect: 0.1,
    type: 'passive'
  },
  {
    id: 'gpu_miner',
    name: 'GPU Miner',
    description: 'A more powerful miner with multiple GPUs',
    baseCost: 100,
    cost: 100,
    level: 0,
    effect: 1,
    type: 'passive'
  },
  {
    id: 'mining_farm',
    name: 'Mining Farm',
    description: 'A large setup of mining equipment',
    baseCost: 1100,
    cost: 1100,
    level: 0,
    effect: 8,
    type: 'passive'
  },
  {
    id: 'quantum_miner',
    name: 'Quantum Miner',
    description: 'Utilizes quantum computing for extremely efficient mining',
    baseCost: 12000,
    cost: 12000,
    level: 0,
    effect: 50,
    type: 'passive'
  },
];

const initialState: GameState = {
  tokens: 0,
  tokensPerClick: 1,
  tokensPerSecond: 0,
  totalTokensEarned: 0,
  clicks: 0,
  lastSaved: Date.now(),
  upgrades: defaultUpgrades,
};

const SAVE_INTERVAL = 10000; // 10 seconds
const LOCAL_STORAGE_KEY = 'btc-clicker-save';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Try to load saved game state
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        return {
          ...parsedState,
          lastSaved: Date.now(),
        };
      } catch (e) {
        console.error('Could not parse saved game state', e);
      }
    }
    return initialState;
  });

  // Calculate passive income
  useEffect(() => {
    const timer = setInterval(() => {
      if (gameState.tokensPerSecond > 0) {
        setGameState((prev) => ({
          ...prev,
          tokens: prev.tokens + prev.tokensPerSecond / 10,
          totalTokensEarned: prev.totalTokensEarned + prev.tokensPerSecond / 10,
        }));
      }
    }, 100);

    return () => clearInterval(timer);
  }, [gameState.tokensPerSecond]);

  // Auto-save game state
  useEffect(() => {
    const saveTimer = setInterval(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
    }, SAVE_INTERVAL);

    return () => clearInterval(saveTimer);
  }, [gameState]);

  // Calculate offline progress when loading the game
  useEffect(() => {
    const now = Date.now();
    const timeOffline = now - gameState.lastSaved;
    if (timeOffline > 5000 && gameState.tokensPerSecond > 0) {
      const offlineEarnings = (gameState.tokensPerSecond * timeOffline) / 1000;
      setGameState((prev) => ({
        ...prev,
        tokens: prev.tokens + offlineEarnings,
        totalTokensEarned: prev.totalTokensEarned + offlineEarnings,
        lastSaved: now,
      }));
    }
  }, []);

  const clickBitcoin = () => {
    setGameState((prev) => ({
      ...prev,
      tokens: prev.tokens + prev.tokensPerClick,
      totalTokensEarned: prev.totalTokensEarned + prev.tokensPerClick,
      clicks: prev.clicks + 1,
    }));
  };

  const buyUpgrade = (id: string) => {
    setGameState((prev) => {
      const upgrades = [...prev.upgrades];
      const upgradeIndex = upgrades.findIndex(u => u.id === id);
      
      if (upgradeIndex === -1) return prev;
      
      const upgrade = upgrades[upgradeIndex];
      
      if (prev.tokens < upgrade.cost) return prev;
      
      const newLevel = upgrade.level + 1;
      const newCost = Math.floor(upgrade.baseCost * Math.pow(1.15, newLevel));
      
      upgrades[upgradeIndex] = {
        ...upgrade,
        level: newLevel,
        cost: newCost,
      };
      
      let tokensPerClick = prev.tokensPerClick;
      let tokensPerSecond = prev.tokensPerSecond;
      
      if (upgrade.type === 'click') {
        tokensPerClick = 1 + upgrades
          .filter(u => u.type === 'click')
          .reduce((sum, u) => sum + (u.effect * u.level), 0);
      } else if (upgrade.type === 'passive') {
        tokensPerSecond = upgrades
          .filter(u => u.type === 'passive')
          .reduce((sum, u) => sum + (u.effect * u.level), 0);
      }
      
      return {
        ...prev,
        tokens: prev.tokens - upgrade.cost,
        upgrades,
        tokensPerClick,
        tokensPerSecond,
      };
    });
  };

  const resetGame = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setGameState(initialState);
  };

  return {
    gameState,
    clickBitcoin,
    buyUpgrade,
    resetGame,
  };
};
