import { create } from "zustand";

// Game state types
interface GameState {
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
  // Game actions
  setScore: (score: number) => void;
  incrementScore: () => void;
  setGameOver: (isOver: boolean) => void;
  setPaused: (isPaused: boolean) => void;
  resetGame: () => void;
}

// Initial state
const initialState = {
  score: 0,
  isGameOver: false,
  isPaused: false,
};

// Create the store
export const useGameStore = create<GameState>(set => ({
  ...initialState,

  // Actions
  setScore: score => set({ score }),
  incrementScore: () => set(state => ({ score: state.score + 1 })),
  setGameOver: isOver => set({ isGameOver: isOver }),
  setPaused: isPaused => set({ isPaused }),
  resetGame: () => set(initialState),
}));
