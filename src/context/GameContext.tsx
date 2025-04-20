import { createContext, useContext, useEffect, useState } from "react";
import { GameState, GameContextType } from "@/types/game";

const initialGameState: GameState = {
  score: 0,
  currentStreak: 0,
  highestStreak: 0,
  postsCompleted: [],
  hintsUsed: [],
};

const GameContext = createContext<GameContextType | undefined>(undefined);

// Define props for GameProvider
interface GameProviderProps {
  children: React.ReactNode;
  lessonId: string;
}

export function GameProvider({ children, lessonId }: GameProviderProps) {
  // Derive localStorage key from lessonId
  const storageKey = `gameState-${lessonId}`;
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  // Load state from localStorage based on lessonId
  useEffect(() => {
    const savedState = localStorage.getItem(storageKey);
    if (savedState) {
      setGameState(JSON.parse(savedState));
    } else {
      // Reset to initial if no saved state for this lesson
      setGameState(initialGameState);
    }
    // Reload/reset when lessonId changes
  }, [lessonId, storageKey]);

  // Save state to localStorage based on lessonId
  useEffect(() => {
    // Don't save initial state immediately on load if it wasn't loaded
    if (
      localStorage.getItem(storageKey) ||
      JSON.stringify(gameState) !== JSON.stringify(initialGameState)
    ) {
      localStorage.setItem(storageKey, JSON.stringify(gameState));
    }
  }, [gameState, storageKey]);

  const updateScore = (points: number) => {
    setGameState((prev) => ({
      ...prev,
      score: prev.score + points,
    }));
  };

  const updateStreak = (correct: boolean) => {
    setGameState((prev) => {
      const newStreak = correct ? prev.currentStreak + 1 : 0;
      return {
        ...prev,
        currentStreak: newStreak,
        highestStreak: Math.max(prev.highestStreak, newStreak),
      };
    });
  };

  const markPostComplete = (postId: string) => {
    setGameState((prev) => ({
      ...prev,
      postsCompleted: [...prev.postsCompleted, postId],
    }));
  };

  const addHint = (postId: string) => {
    setGameState((prev) => ({
      ...prev,
      hintsUsed: [...prev.hintsUsed, postId],
    }));
  };

  const resetGame = () => {
    setGameState(initialGameState);
    // Optionally clear localStorage for this lesson on reset
    // localStorage.removeItem(storageKey);
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        updateScore,
        updateStreak,
        markPostComplete,
        addHint,
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
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
