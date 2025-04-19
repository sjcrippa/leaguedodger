import { create } from "zustand";
import { useEnemyStore } from "./enemyStore";

interface LevelState {
  currentLevel: number;
  maxLevel: number;
  enemiesPerLevel: number;
  enemiesDefeated: number;
  isLevelComplete: boolean;
  // Actions
  incrementLevel: () => void;
  incrementEnemiesDefeated: () => void;
  checkLevelCompletion: () => void;
  resetLevel: () => void;
  setLevelComplete: (isComplete: boolean) => void;
}

// Function to calculate the level properties
const calculateLevelProperties = (level: number) => {
  const baseEnemies = 5;
  const enemiesIncrement = 2;
  const levelMultiplier = Math.pow(1.3, level - 1); // 30% more per level

  return {
    enemiesPerLevel: baseEnemies + enemiesIncrement * (level - 1), // 5, 7, 9, 11, etc.
    enemySpeed: 0.1 * levelMultiplier,
    enemyHealth: 100 * levelMultiplier,
    enemyDamage: 10 * levelMultiplier,
    spawnInterval: Math.max(800, 2000 / levelMultiplier), // minimum 800ms
    projectileSpeed: 1.2 * levelMultiplier,
  };
};

const initialState = {
  currentLevel: 1,
  maxLevel: 10,
  enemiesPerLevel: 5,
  enemiesDefeated: 0,
  isLevelComplete: false,
};

export const useLevelStore = create<LevelState>((set, get) => ({
  ...initialState,

  incrementLevel: () => {
    const nextLevel = Math.min(get().currentLevel + 1, get().maxLevel);
    const levelProps = calculateLevelProperties(nextLevel);

    set(() => ({
      currentLevel: nextLevel,
      enemiesPerLevel: levelProps.enemiesPerLevel,
      enemiesDefeated: 0,
      isLevelComplete: false,
    }));

    // Update the enemies configuration and reset the system
    const enemyStore = useEnemyStore.getState();
    enemyStore.updateConfig(levelProps);
    enemyStore.reset();
  },

  incrementEnemiesDefeated: () => {
    set(state => ({
      enemiesDefeated: state.enemiesDefeated + 1,
    }));
    get().checkLevelCompletion();
  },

  checkLevelCompletion: () => {
    const { enemiesDefeated, enemiesPerLevel } = get();
    if (enemiesDefeated >= enemiesPerLevel) {
      set({ isLevelComplete: true });
    }
  },

  setLevelComplete: (isComplete: boolean) => {
    set({ isLevelComplete: isComplete });
  },

  resetLevel: () => {
    const initialProps = calculateLevelProperties(1);
    set({
      ...initialState,
      enemiesPerLevel: initialProps.enemiesPerLevel,
    });
    useEnemyStore.getState().updateConfig(initialProps);
  },
}));
