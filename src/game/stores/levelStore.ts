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

// Función para calcular las propiedades del nivel
const calculateLevelProperties = (level: number) => {
  const baseEnemies = 5;
  const levelMultiplier = Math.pow(1.2, level - 1); // 20% más por nivel
  
  return {
    enemiesPerLevel: Math.floor(baseEnemies * levelMultiplier),
    enemySpeed: 0.08 * levelMultiplier,
    enemyHealth: 100 * levelMultiplier,
    enemyDamage: 10 * levelMultiplier,
    spawnInterval: Math.max(800, 2000 / levelMultiplier) // Mínimo 800ms
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
      isLevelComplete: false
    }));

    // Actualizar la configuración de enemigos
    useEnemyStore.getState().updateConfig(levelProps);
  },

  incrementEnemiesDefeated: () => {
    set(state => ({ 
      enemiesDefeated: state.enemiesDefeated + 1 
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
      enemiesPerLevel: initialProps.enemiesPerLevel
    });
    useEnemyStore.getState().updateConfig(initialProps);
  }
})); 