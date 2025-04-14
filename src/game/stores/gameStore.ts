import { create } from "zustand";
import { useLevelStore } from "./levelStore";

// Game state types
interface GameState {
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
  enemyProjectilesEnabled: boolean;
  currentLevel: number;
  // Game actions
  setScore: (score: number) => void;
  incrementScore: () => void;
  setGameOver: (isOver: boolean) => void;
  setPaused: (isPaused: boolean) => void;
  toggleEnemyProjectiles: () => void;
  resetGame: () => void;
}

// Initial state
const initialState = {
  score: 0,
  isGameOver: false,
  isPaused: false,
  enemyProjectilesEnabled: true,
  currentLevel: 1,
};

// Create the store
export const useGameStore = create<GameState>(set => ({
  ...initialState,

  // Actions
  setScore: score => set({ score }),
  incrementScore: () => set(state => ({ score: state.score + 1 })),
  setGameOver: isOver => set({ isGameOver: isOver }),
  setPaused: isPaused => set({ isPaused }),
  toggleEnemyProjectiles: () => set((state) => ({ 
    enemyProjectilesEnabled: !state.enemyProjectilesEnabled 
  })),
  resetGame: () => {
    set(initialState);
    useLevelStore.getState().resetLevel();
  },
}));
