import { createContext, useContext, useEffect, useState } from 'react';
import { GameState, GameContextType } from '@/types/game';

const initialGameState: GameState = {
  score: 0,
  currentStreak: 0,
  highestStreak: 0,
  postsCompleted: [],
  hintsUsed: [],
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  useEffect(() => {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      setGameState(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [gameState]);

  const updateScore = (points: number) => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
    }));
  };

  const updateStreak = (correct: boolean) => {
    setGameState(prev => {
      const newStreak = correct ? prev.currentStreak + 1 : 0;
      return {
        ...prev,
        currentStreak: newStreak,
        highestStreak: Math.max(prev.highestStreak, newStreak),
      };
    });
  };

  const markPostComplete = (postId: string) => {
    setGameState(prev => ({
      ...prev,
      postsCompleted: [...prev.postsCompleted, postId],
    }));
  };

  const useHint = (postId: string) => {
    setGameState(prev => ({
      ...prev,
      hintsUsed: [...prev.hintsUsed, postId],
    }));
  };

  const resetGame = () => {
    setGameState(initialGameState);
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        updateScore,
        updateStreak,
        markPostComplete,
        useHint,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
} 