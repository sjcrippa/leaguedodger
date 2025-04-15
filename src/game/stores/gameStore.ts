import { create } from "zustand";
import { useLevelStore } from "./levelStore";

// Game state types
interface GameState {
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
  enemyProjectilesEnabled: boolean;
  currentLevel: number;
  countdown: number | null;
  // Game actions
  setScore: (score: number) => void;
  incrementScore: () => void;
  setGameOver: (isOver: boolean) => void;
  setPaused: (isPaused: boolean) => void;
  toggleEnemyProjectiles: () => void;
  resetGame: () => void;
  startCountdown: () => void;
  updateCountdown: () => void;
}

// Initial state
const initialState = {
  score: 0,
  isGameOver: false,
  isPaused: false,
  enemyProjectilesEnabled: true,
  currentLevel: 1,
  countdown: null,
};

// Create the store
export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,

  // Actions
  setScore: score => set({ score }),
  incrementScore: () => set(state => ({ score: state.score + 25 })),
  setGameOver: isOver => set({ isGameOver: isOver }),
  setPaused: isPaused => set({ isPaused }),
  toggleEnemyProjectiles: () =>
    set(state => ({
      enemyProjectilesEnabled: !state.enemyProjectilesEnabled,
    })),
  startCountdown: () => set({ countdown: 3 }),
  updateCountdown: () => {
    const { countdown } = get();
    if (countdown === null) return;

    if (countdown <= 1) {
      set({ countdown: null });
    } else {
      set({ countdown: countdown - 1 });
    }
  },
  resetGame: () => {
    set(initialState);
    useLevelStore.getState().resetLevel();
  },
}));
